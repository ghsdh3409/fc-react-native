#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalendarModule, NSObject)
RCT_EXTERN_METHOD(createCalendarEvent:(double)timestampInSec
                  title:(NSString *)title
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
@end
