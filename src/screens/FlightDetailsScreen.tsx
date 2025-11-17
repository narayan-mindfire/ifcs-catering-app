import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App'; 

import { PreparationsScreen } from './details/Preparations';
import { FoodOrderScreen } from './details/FoodOrder';
import { InvoiceScreen } from './details/Invoice';
import { DeliveriesScreen } from './details/Deliveries';
import { Header } from '../components/dashboard/Header';
import { Breadcrumb } from '../components/common/BreadCrumbs';

type FlightDetailTabParamList = {
  Preparations: undefined;
  FoodOrder: undefined;
  Deliveries: undefined;
  Invoice: undefined;
};

const Tab = createMaterialTopTabNavigator<FlightDetailTabParamList>();

type Props = StackScreenProps<RootStackParamList, 'FlightDetails'>;

const FlightDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { flightId, route: flightRoute, date } = route.params;

  const [currentTab, setCurrentTab] = React.useState('Preparations');

  const CustomTabBar = (props: any) => {
    const { state, descriptors, navigation } = props;
    const activeColor = '#007AFF';
    const inactiveColor = '#8e8e93';

    return (
      <View style={styles.tabBarContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabButton,
                isFocused ? styles.tabButtonActive : styles.tabButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isFocused ? '#fff' : inactiveColor },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header userName={'Shitanshu'} onUserPress={()=>{}} />
        <Breadcrumb currentScreen={currentTab as keyof RootStackParamList} />

        <View style={styles.flightInfo}>
          <Text style={styles.infoText}>FLIGHT: {flightId}</Text>
          <Text style={styles.infoText}>ROUTE: {flightRoute}</Text>
          <Text style={styles.infoText}>DATE: {date}</Text>
        </View>
      </View>

      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenListeners={{
          state: (e) => {
            const state = e.data.state;
            const activeIndex = state.index;
            const activeName = state.routes[activeIndex].name;
            setCurrentTab(activeName);
          },
        }}
      >
        <Tab.Screen name="Preparations" component={PreparationsScreen} />
        <Tab.Screen name="FoodOrder" component={FoodOrderScreen} />
        <Tab.Screen name="Deliveries" component={DeliveriesScreen} />
        <Tab.Screen name="Invoice" component={InvoiceScreen} />
      </Tab.Navigator>
    </View>
  );
};


export default FlightDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  breadcrumb: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  flightInfo: {
    flexDirection: 'row',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 20,
  },
  tabBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12, 
    paddingTop: 10,
    backgroundColor: '#fff',
    gap: 8, 
  },
  tabButton: {
    flex: 1, 
    paddingVertical: 16, 
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  tabButtonActive: {
    backgroundColor: '#007AFF',
  },
  tabButtonInactive: {
    backgroundColor: '#f0f0f0',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});