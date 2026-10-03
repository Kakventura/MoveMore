import { createElement, useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import type { RoutePoint } from '@/@types/route';
import { Colors } from '@/constants/colors';

interface Props { center: RoutePoint; points: RoutePoint[]; fit?: boolean }

const BASE = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4';
let leafletPromise: Promise<any> | null = null;

// Carrega o Leaflet uma única vez (mapa OpenStreetMap, não precisa de chave de API)
function loadLeaflet(): Promise<any> {
  const w = window as any;
  if (w.L) return Promise.resolve(w.L);
  if (!leafletPromise) {
    leafletPromise = new Promise((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = `${BASE}/leaflet.min.css`;
      document.head.appendChild(css);
      const script = document.createElement('script');
      script.src = `${BASE}/leaflet.min.js`;
      script.onload = () => resolve(w.L);
      script.onerror = () => { leafletPromise = null; reject(new Error('Falha ao carregar o mapa. Verifique a internet.')); };
      document.body.appendChild(script);
    });
  }
  return leafletPromise;
}

export function RouteMap({ center, points, fit = false }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const line = useRef<any>(null);
  const marker = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  // Cria o mapa uma vez
  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !container.current) return;
      map.current = L.map(container.current).setView([center.latitude, center.longitude], 17);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map.current);
      line.current = L.polyline([], { color: Colors.forest, weight: 5 }).addTo(map.current);
      marker.current = L.circleMarker([center.latitude, center.longitude], { radius: 8, color: '#fff', weight: 2, fillColor: '#2563eb', fillOpacity: 1 }).addTo(map.current);
      setReady(true);
    }).catch((e: Error) => setError(e.message));
    return () => { cancelled = true; map.current?.remove(); map.current = null; setReady(false); };
  }, []);

  // Atualiza o trajeto e a posição
  useEffect(() => {
    if (!ready || !map.current) return;
    const latlngs = points.map((p) => [p.latitude, p.longitude]);
    const current = points.at(-1) ?? center;
    line.current.setLatLngs(latlngs);
    marker.current.setLatLng([current.latitude, current.longitude]);
    if (fit && latlngs.length > 1) map.current.fitBounds(line.current.getBounds(), { padding: [30, 30] });
    else if (!fit) map.current.panTo([current.latitude, current.longitude]);
  }, [ready, points, center, fit]);

  if (error) return <Text style={{ color: Colors.danger, marginBottom: 12 }}>{error}</Text>;
  return createElement('div', { ref: container, style: { width: '100%', height: 300, borderRadius: 12, marginBottom: 12, zIndex: 0 } });
}
