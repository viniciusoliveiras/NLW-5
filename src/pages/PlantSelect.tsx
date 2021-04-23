import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { Header } from '../components/Header';
import { EnviromentButton } from '../components/EnviromentButton';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import api from '../services/api';

import { PlantProps } from '../libs/storage';

interface EnvironmentsProps {
  key: string;
  title: string;
}

export function PlantSelect() {
  const [environments, setEnvironments] = useState<EnvironmentsProps[]>([]);
  const [environmentSelected, setEnvironmentSelected] = useState('all');

  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);

  const navigation = useNavigation();

  async function fetchPlants() {
    const { data } = await api.get(
      `plants?_sort=name&_order=asc&_page=${page}&_limit=10`
    );

    if (!data) return setIsLoading(true);

    if (page > 1) {
      setPlants((oldValue) => [...oldValue, ...data]);
      setFilteredPlants((oldValue) => [...oldValue, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }

    setIsLoading(false);
    setLoadMore(false);
  }

  function handleEnvironmentSelect(environment: string) {
    setEnvironmentSelected(environment);

    if (environment == 'all') return setFilteredPlants(plants);

    const filtered = plants.filter((plant) =>
      plant.environments.includes(environment)
    );

    setFilteredPlants(filtered);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) return;

    setLoadMore(true);
    setPage((oldValue) => oldValue + 1);
    fetchPlants();
  }

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate('PlantSave', { plant });
  }

  useEffect(() => {
    async function fetchEnvironment() {
      const response = await api.get(
        'plants_environments?_sort=title&_order=asc'
      );
      setEnvironments([
        {
          key: 'all',
          title: 'Todos',
        },
        ...response.data,
      ]);
    }

    fetchEnvironment();
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  if (isLoading) return <Load />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header isHomeScreen={true} />

        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>voce quer colocar sua planta?</Text>
      </View>

      <View>
        <FlatList
          data={environments}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <EnviromentButton
              key={item.key}
              title={item.title}
              active={item.key === environmentSelected}
              onPress={() => handleEnvironmentSelect(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.enviromentList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardPrimary
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            loadMore ? <ActivityIndicator color={colors.green_dark} /> : <></>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingBottom: Platform.OS === 'android' ? 15 : 0,
  },
  header: { paddingHorizontal: 32 },
  title: {
    fontSize: 17,
    color: colors.body_light,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 17,
    color: colors.body_light,
    fontFamily: fonts.text,
    lineHeight: 20,
  },
  enviromentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 35,
    marginVertical: 32,
    paddingRight: 62,
  },
  plants: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
});
