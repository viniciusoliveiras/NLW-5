import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import waterdrop from '../assets/waterdrop.png';

import { Header } from '../components/Header';
import { loadPlant, PlantProps } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextWaterd, setNextWaterd] = useState('');

  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlant();

      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification),
        new Date().getTime(),
        { locale: ptBR }
      );

      setNextWaterd(`Regue sua ${plantsStoraged[0].name} daqui à ${nextTime}`);

      setMyPlants(plantsStoraged);

      setIsLoading(false);
    }

    loadStorageData();
  }, []);

  return (
    <View style={styles.container}>
      <Header title='Minhas' />

      <View style={styles.spotlight}>
        <Image source={waterdrop} style={styles.spotlightImage} />
        <Text style={styles.spotlightText}>{nextWaterd}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <PlantCardSecondary data={item} />}
          showsVerticalScrollIndicator={false}
          numColumns={1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    marginTop: 35,
    borderRadius: 20,
    height: 88,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotlightImage: {
    width: 56,
    height: 56,
  },
  spotlightText: {
    flex: 1,
    paddingHorizontal: 20,
    textAlign: 'center',
    color: colors.blue,
    fontSize: 15,
  },
  plants: { flex: 1, width: '100%', marginTop: 40 },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginBottom: 16,
  },
});
