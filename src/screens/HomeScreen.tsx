import { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useAuth } from '../store/auth';

const API_URL = 'https://steamsense-api-production.up.railway.app';

export default function HomeScreen() {
  const { token, user, isLoading, login, logout, restore } = useAuth();

  useEffect(() => {
    restore();
  }, []);

  const handleLogin = async () => {
    const redirectUri = AuthSession.makeRedirectUri();
    const authUrl = `${API_URL}/auth/steam?redirect_uri=${encodeURIComponent(redirectUri)}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === 'success' && result.url) {
      const url = new URL(result.url);
      const tokenParam = url.searchParams.get('token');
      const userParam = url.searchParams.get('user');

      if (tokenParam && userParam) {
        const userData = JSON.parse(userParam);
        await login(tokenParam, userData);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  if (!token || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>SteamSense</Text>
        <Text style={styles.subtitle}>Discover your next favourite game</Text>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in with Steam</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      <Text style={styles.title}>Welcome, {user.display_name}!</Text>
      <Text style={styles.subtitle}>Steam ID: {user.steam_id}</Text>
      <Pressable style={[styles.button, styles.logoutButton]} onPress={logout}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a2e', padding: 20 },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#888', marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, borderWidth: 2, borderColor: '#e94560' },
  button: { backgroundColor: '#e94560', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 },
  logoutButton: { backgroundColor: '#333', marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
