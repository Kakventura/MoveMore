// Papel: renderizar mapas e trajetos no Android usando Leaflet dentro de uma WebView.
// Motivo: compartilhar a visualização de rotas no app nativo sem implementar mapas nativos distintos.
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { View } from 'react-native';
import { WebView as RNWebView } from 'react-native-webview';
import type { RoutePoint } from '@/@types/route';
import { Colors } from '@/constants/colors';

interface Props {
  center: RoutePoint;
  points: RoutePoint[];
  fit?: boolean; // true = enquadra a rota inteira (tela de detalhes); false = segue o usuário
}

// Tipagem solta: evita o erro "props: never" quando os tipos do React não casam com os da WebView
const WebView = RNWebView as unknown as ComponentType<any>;

const LEAFLET = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4';

// Página do mapa (Leaflet + OpenStreetMap). O app só chama update() com os dados novos.
const HTML = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="${LEAFLET}/leaflet.min.css"/>
<style>html,body,#map{height:100%;margin:0;background:#eee}</style></head>
<body><div id="map"></div>
<script src="${LEAFLET}/leaflet.min.js"></script>
<script>
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
var line = L.polyline([], { color: '${Colors.forest}', weight: 5 }).addTo(map);
var me = L.circleMarker([0, 0], { radius: 8, color: '${Colors.white}', weight: 2, fillColor: '${Colors.orange}', fillOpacity: 1 }).addTo(map);
var first = true;
function update(d) {
  line.setLatLngs(d.pts);
  me.setLatLng(d.cur);
  if (d.fit && d.pts.length > 1) map.fitBounds(line.getBounds(), { padding: [30, 30] });
  else if (first) { map.setView(d.cur, 17); first = false; }
  else map.panTo(d.cur);
}
</script></body></html>`;

export function RouteMap({ center, points, fit = false }: Props) {
  // Envia ao mapa embarcado os pontos atuais e escolhe entre acompanhar a posição ou enquadrar o trajeto.
  const web = useRef<{ injectJavaScript: (js: string) => void }>(null);
  const [loaded, setLoaded] = useState(false);

  // Envia trajeto e posição para dentro da página sempre que mudarem
  useEffect(() => {
    if (!loaded) return;
    const cur = points.at(-1) ?? center;
    const data = { pts: points.map((p) => [p.latitude, p.longitude]), cur: [cur.latitude, cur.longitude], fit };
    web.current?.injectJavaScript(`typeof update==='function' && update(${JSON.stringify(data)}); true;`);
  }, [loaded, points, center, fit]);

  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ height: 300, borderRadius: 12, overflow: 'hidden' }}>
        <WebView
          ref={web}
          originWhitelist={['*']}
          source={{ html: HTML, baseUrl: 'https://diario-rotas.app' }}
          javaScriptEnabled
          nestedScrollEnabled
          onLoadEnd={() => setLoaded(true)}
        />
      </View>
    </View>
  );
}
