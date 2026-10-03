import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import { Colors } from '@/constants/colors';

interface Props {
  userId: string;
  username: string;
}

const optionStyle: CSSProperties = {
  minHeight: 36,
  padding: '7px 12px',
  borderRadius: 8,
  border: 'none',
  background: Colors.white,
  color: Colors.forest,
  fontFamily: 'PTSansNarrow',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'left',
};

export function ProfilePhoto({ userId, username }: Props) {
  const [photo, setPhoto] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const storageKey = `@diario-rotas/${userId}/profile-photo`;
  const initials = username.slice(0, 1).toLocaleUpperCase('pt-BR') || '?';

  useEffect(() => {
    try {
      setPhoto(window.localStorage.getItem(storageKey) ?? '');
    } catch {
      setError('O navegador não permite acessar o armazenamento local para carregar a foto.');
    }
  }, [storageKey]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!cameraOpen || !video || !stream) return;

    video.srcObject = stream;
    video.play().catch(() => {
      setError('Não foi possível iniciar a prévia da câmera.');
    });
  }, [cameraOpen]);

  async function startCamera() {
    setMenuOpen(false);
    setError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Este navegador não permite acessar a câmera. Escolha uma foto do computador.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      setCameraOpen(true);
    } catch {
      setError('Não foi possível acessar a câmera. Verifique a permissão do navegador ou escolha uma foto.');
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }

  function removePhoto() {
    try {
      window.localStorage.removeItem(storageKey);
      setPhoto('');
      setError('');
      setMenuOpen(false);
      stopCamera();
    } catch {
      setError('Não foi possível remover a foto salva neste navegador.');
    }
  }

  function savePhoto(dataUrl: string) {
    try {
      window.localStorage.setItem(storageKey, dataUrl);
      setPhoto(dataUrl);
      setError('');
      stopCamera();
    } catch {
      setError('Não foi possível salvar a foto neste navegador. Tente uma imagem menor.');
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setError('A câmera ainda está iniciando. Tente novamente em instantes.');
      return;
    }

    const longestSide = 640;
    const scale = Math.min(1, longestSide / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext('2d');
    if (!context) {
      setError('Não foi possível processar a foto. Escolha um arquivo de imagem.');
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    savePhoto(canvas.toDataURL('image/jpeg', 0.82));
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    setMenuOpen(false);
    if (!file.type.startsWith('image/')) {
      setError('Escolha um arquivo de imagem válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') savePhoto(reader.result);
      else setError('Não foi possível carregar a imagem selecionada.');
    };
    reader.onerror = () => setError('Não foi possível ler a imagem selecionada.');
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: 96, height: 96 }}>
        {photo ? (
          <img
            src={photo}
            alt={`Foto de perfil de ${username}`}
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              objectFit: 'cover',
              border: `3px solid ${Colors.orange}`,
            }}
          />
        ) : (
          <div style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: Colors.forest,
            color: Colors.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'PTSansNarrowBold',
            fontSize: 36,
          }}>
            {initials}
          </div>
        )}
        <button
          type="button"
          aria-label="Opções da foto de perfil"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            position: 'absolute',
            right: -2,
            bottom: -2,
            width: 34,
            height: 34,
            padding: 0,
            borderRadius: 17,
            border: `2px solid ${Colors.white}`,
            background: Colors.orange,
            color: Colors.ink,
            fontSize: 16,
            lineHeight: '30px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          📷
        </button>
        {menuOpen && (
          <div
            role="menu"
            style={{
              position: 'absolute',
              zIndex: 10,
              top: 104,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minWidth: 156,
              padding: 5,
              borderRadius: 10,
              background: Colors.white,
              border: `1px solid ${Colors.line}`,
              boxShadow: '0 6px 18px rgba(0,0,0,0.16)',
            }}
          >
            <button type="button" role="menuitem" style={optionStyle} onClick={startCamera}>
              Tirar foto
            </button>
            <button
              type="button"
              role="menuitem"
              style={optionStyle}
              onClick={() => {
                setMenuOpen(false);
                fileRef.current?.click();
              }}
            >
              Escolher foto
            </button>
            {photo && (
              <button
                type="button"
                role="menuitem"
                style={{ ...optionStyle, color: Colors.danger }}
                onClick={removePhoto}
              >
                Remover foto
              </button>
            )}
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      {cameraOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: 260, maxWidth: '100%', borderRadius: 12, background: Colors.ink }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={optionStyle} onClick={capturePhoto}>Capturar</button>
            <button type="button" style={optionStyle} onClick={stopCamera}>Cancelar</button>
          </div>
        </div>
      )}
      {error ? (
        <div role="alert" style={{ color: Colors.danger, textAlign: 'center', maxWidth: 320 }}>
          {error}
        </div>
      ) : null}
      <div style={{ color: Colors.muted, fontSize: 14, textAlign: 'center' }}>
        A foto é salva somente neste navegador.
      </div>
    </div>
  );
}
