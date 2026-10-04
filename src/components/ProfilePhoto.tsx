import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { AppText as Text } from '@/components/AppText';
import { Icon } from '@/components/Icon';
import { Colors } from '@/constants/colors';
import { notify } from '@/utils/feedback';

interface Props {
  userId: string;
  username: string;
}

export function ProfilePhoto({ userId, username }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);
  const storageKey = `@diario-rotas/${userId}/profile-photo`;
  const initials = username.slice(0, 1).toLocaleUpperCase('pt-BR') || '?';

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey).then((storedPhoto) => {
      if (active) setPhoto(storedPhoto);
    }).catch(() => notify('Não foi possível carregar a foto de perfil.'));
    return () => { active = false; };
  }, [storageKey]);

  async function choosePhoto(useCamera: boolean) {
    try {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.55,
            base64: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.55,
            base64: true,
          });

      if (result.canceled) return;
      const image = result.assets[0];
      if (!image.base64) {
        notify('Não foi possível processar a foto. Escolha outra imagem.');
        return;
      }

      const dataUrl = `data:${image.mimeType ?? 'image/jpeg'};base64,${image.base64}`;
      await AsyncStorage.setItem(storageKey, dataUrl);
      setPhoto(dataUrl);
    } catch {
      notify(useCamera
        ? 'Não foi possível abrir a câmera. Verifique as permissões do aplicativo.'
        : 'Não foi possível abrir as fotos do dispositivo.');
    }
  }

  function openOptions() {
    const options = [
      { text: 'Tirar foto', onPress: () => { void choosePhoto(true); } },
      { text: 'Escolher foto', onPress: () => { void choosePhoto(false); } },
    ];

    if (photo) {
      options.push({
        text: 'Remover foto',
        onPress: () => {
          AsyncStorage.removeItem(storageKey).then(() => setPhoto(null))
            .catch(() => notify('Não foi possível remover a foto de perfil.'));
        },
      });
    }

    Alert.alert('Foto de perfil', 'Escolha uma opção', [
      ...options,
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  return (
    <View style={{ width: 96, height: 96, marginBottom: 12 }}>
      {photo ? (
        <Image
          accessibilityLabel={`Foto de perfil de ${username}`}
          source={{ uri: photo }}
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            borderWidth: 3,
            borderColor: Colors.orange,
          }}
        />
      ) : (
        <View style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: Colors.forest,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ color: Colors.white, fontSize: 36, fontWeight: '700' }}>{initials}</Text>
        </View>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Opções da foto de perfil"
        onPress={openOptions}
        style={{
          position: 'absolute',
          right: -2,
          bottom: -2,
          width: 34,
          height: 34,
          borderRadius: 17,
          borderWidth: 2,
          borderColor: Colors.white,
          backgroundColor: Colors.orange,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 3,
        }}
      >
        <Icon name="camera" size={18} color={Colors.ink} />
      </Pressable>
    </View>
  );
}