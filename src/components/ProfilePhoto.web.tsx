import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/Icon';
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

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: 'rgba(42,18,56,0.72)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
};

const panelStyle: CSSProperties = {
  background: Colors.white,
  borderRadius: 24,
  padding: 18,
  width: '100%',
  maxWidth: 400,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
};

const titleStyle: CSSProperties = {
  fontFamily: 'PTSansNarrowBold',
  fontSize: 22,
  color: Colors.ink,
  textAlign: 'center',
  marginBottom: 4,
};

const bigButton: CSSProperties = {
  ...optionStyle,
  minHeight: 48,
  borderRadius: 14,
  fontSize: 18,
  textAlign: 'center',
  background: '#EFE6F6',
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
    <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 12 }}>
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
            boxSizing: 'border-box',
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}
      >
        <Icon name="camera" size={18} color={Colors.ink} />
      </button>

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

      {/* Menu de opções: janela por cima de tudo (portal para o <body>) */}
      {menuOpen && createPortal(
        <div style={overlayStyle} onClick={() => setMenuOpen(false)}>
          <div role="menu" style={panelStyle} onClick={(e) => e.stopPropagation()}>
            <div style={titleStyle}>Foto de perfil</div>
            <button type="button" role="menuitem" style={bigButton} onClick={startCamera}>
              Tirar foto
            </button>
            <button
              type="button"
              role="menuitem"
              style={bigButton}
              onClick={() => {
                setMenuOpen(false);
                fileRef.current?.click();
              }}
            >
              Escolher foto
            </button>
            {photo && (
              <button type="button" role="menuitem" style={{ ...bigButton, color: Colors.danger }} onClick={removePhoto}>
                Remover foto
              </button>
            )}
            <button type="button" style={{ ...bigButton, background: Colors.white, border: `1.5px solid ${Colors.line}` }} onClick={() => setMenuOpen(false)}>
              Cancelar
            </button>
            <div style={{ color: Colors.muted, fontSize: 14, textAlign: 'center', fontFamily: 'PTSansNarrow' }}>
              A foto fica salva só neste navegador.
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* Câmera: janela por cima de tudo */}
      {cameraOpen && createPortal(
        <div style={overlayStyle}>
          <div style={panelStyle}>
            <div style={titleStyle}>Tirar foto de perfil</div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', borderRadius: 16, background: Colors.ink, transform: 'scaleX(-1)' }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" style={{ ...bigButton, flex: 1, background: Colors.orange, color: Colors.ink }} onClick={capturePhoto}>
                Capturar
              </button>
              <button type="button" style={{ ...bigButton, flex: 1 }} onClick={stopCamera}>
                Cancelar
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* Erro: aviso flutuante na parte de baixo da tela */}
      {error ? createPortal(
        <div
          role="alert"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 24,
            transform: 'translateX(-50%)',
            zIndex: 2000,
            maxWidth: 'calc(100vw - 32px)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 14,
            background: Colors.danger,
            color: Colors.white,
            fontFamily: 'PTSansNarrow',
            fontSize: 16,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          <span>{error}</span>
          <button
            type="button"
            aria-label="Fechar aviso"
            onClick={() => setError('')}
            style={{ border: 'none', background: 'rgba(255,255,255,0.25)', color: Colors.white, borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontFamily: 'PTSansNarrow', fontSize: 15 }}
          >
            OK
          </button>
        </div>,
        document.body,
      ) : null}
    </div>
  );
}