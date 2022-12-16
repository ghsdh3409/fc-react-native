import React from 'react';
import Screen from '../../components/Screen';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OpenColor from 'open-color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: OpenColor.white,
  },
  subtitleText: {
    marginTop: 30,
    fontSize: 16,
    color: OpenColor.white,
    textAlign: 'center',
  },
  products: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 80,
  },
  product: {
    backgroundColor: OpenColor.white,
    width: '100%',
    paddingVertical: 20,
    borderRadius: 12,
    margin: 12,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    color: OpenColor.black,
    fontWeight: 'bold',
  },
});

const PurchaseScreen = () => {
  const [products, setProducts] = useState<PurchasesPackage[]>([]);
  useEffect(() => {
    (async () => {
      const offerings = await Purchases.getOfferings();
      if (offerings.current?.availablePackages != null) {
        setProducts(offerings.current.availablePackages);
      }
    })();
  }, []);

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleText}>프리미엄 이용권</Text>
          <Text style={styles.subtitleText}>
            무제한 개봉일 알림 추가와 광고 없이 앱을 사용할 수 있습니다!
          </Text>
        </View>
        <View style={styles.products}>
          {products.map(p => {
            const periodText =
              p.packageType === 'MONTHLY'
                ? '월'
                : p.packageType === 'WEEKLY'
                ? '주'
                : p.packageType;
            return (
              <TouchableOpacity
                key={p.identifier}
                style={styles.product}
                onPress={async () => {
                  try {
                    const result = await Purchases.purchasePackage(p);
                    console.log('result', result);
                    Alert.alert('구매 성공');
                  } catch (e: any) {
                    if (!e.userCancelled) {
                      Alert.alert('구매 실패', e.message);
                    }
                  }
                }}>
                <Text
                  style={
                    styles.priceText
                  }>{`${p.product.priceString}/${periodText}`}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Screen>
  );
};

export default PurchaseScreen;
