package com.daehoonkim.moviereminder

import android.Manifest
import android.content.ContentValues
import android.content.pm.PackageManager
import android.os.Build
import android.provider.CalendarContract
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener
import java.util.TimeZone

class CalendarModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext), PermissionListener {
    override fun getName() = "CalendarModule"

    private var mRequestCode = 0
    private var mCallbacks = HashMap<Int, (grantResults: IntArray?) -> Unit>()

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>?, grantResults: IntArray?): Boolean {
        mCallbacks.get(requestCode)?.invoke(grantResults)
        mCallbacks.remove(requestCode)
        return true
    }

    private fun requestPermission(callback: (granted: Boolean) -> Unit) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            var status = reactApplicationContext.checkPermission(
                    Manifest.permission.WRITE_CALENDAR,
                    android.os.Process.myPid(),
                    android.os.Process.myUid()
            )
            if (status == PackageManager.PERMISSION_GRANTED) {
                callback.invoke(true);
                return
            }
        } else {
            var status = reactApplicationContext.checkSelfPermission(Manifest.permission.WRITE_CALENDAR)
            if (status == PackageManager.PERMISSION_GRANTED) {
                callback.invoke(true)
                return
            }
        }

        var activity = currentActivity as PermissionAwareActivity
        mCallbacks.put(mRequestCode, fun(grantResults) {
            var granted = grantResults != null && grantResults[0] == PackageManager.PERMISSION_GRANTED
            callback.invoke(granted)
        })
        activity.requestPermissions(arrayOf(Manifest.permission.WRITE_CALENDAR), mRequestCode, this)
        mRequestCode += 1
    }


    @ReactMethod fun createCalendarEvent(timestampInSec: Double, title: String, promise: Promise) {
        try {
            requestPermission(fun (granted) {
                if (!granted) {
                    promise.reject("permission_denied", "Permission is denied")
                    return
                }
                val values = ContentValues().apply {
                    put(CalendarContract.Events.DTSTART, timestampInSec * 1000)
                    put(CalendarContract.Events.DTEND, timestampInSec * 1000 + 24 * 3600 * 1000)
                    put(CalendarContract.Events.TITLE, title)
                    put(CalendarContract.Events.CALENDAR_ID, 1)
                    put(CalendarContract.Events.EVENT_TIMEZONE, TimeZone.getDefault().getID())
                }
                val uri = reactApplicationContext.contentResolver.insert(CalendarContract.Events.CONTENT_URI, values)
                promise.resolve(null)
            })
        } catch (error: Throwable) {
            promise.reject("event_failure", error)
        }
    }
}