
import { useState, useEffect } from 'react';

interface ChannelInfo {
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: { url: string };
    };
    customUrl?: string;
  };
  statistics: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
}

interface Video {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      medium: { url: string };
      high: { url: string };
    };
    resourceId: {
      videoId: string;
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  contentDetails: {
    duration: string;
  };
}

export default function YouTubeChannel() {
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'about'>('videos');
  const [isDemoData, setIsDemoData] = useState(false);

  useEffect(() => {
    loadChannelData();
  }, []);

  const loadChannelData = async () => {
    try {
      setLoading(true);
      
      // Cargar información del canal
      const channelResponse = await fetch(
        'https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/youtube-api?action=channel-info'
      );
      const channelData = await channelResponse.json();
      
      if (channelData.success && channelData.data) {
        setChannelInfo(channelData.data);
      }
      
      // Cargar videos del canal
      const videosResponse = await fetch(
        'https://lyurtjkckwggjlzgqyoh.supabase.co/functions/v1/youtube-api?action=videos&maxResults=12'
      );
      const videosData = await videosResponse.json();
      
      if (videosData.success && videosData.data) {
        setVideos(videosData.data);
        setIsDemoData(videosData.isDemoData || false);
      }
      
    } catch (err) {
      setError('Error al cargar datos del canal');
      console.error('Error loading channel data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: string) => {
    const number = parseInt(num);
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '';
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <i className="ri-youtube-line text-2xl text-red-600 animate-pulse"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Hairy Channel</h3>
            <p className="text-gray-600">Cargando datos del canal...</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-4">
                <div className="w-32 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-error-warning-line text-2xl text-red-600"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar el canal</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadChannelData}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header del canal */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-red-500 to-red-600"></div>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        <div className="relative p-6 -mt-16">
          <div className="flex items-start space-x-4">
            <img
              src="https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/d34a730ba634ce3fd227829d4049f4be.png"
              alt="Hairy Channel"
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="flex-1 mt-4">
              <h2 className="text-2xl font-bold text-white mb-1">📺 Hairy Channel</h2>
              <p className="text-red-100 text-sm mb-3">
                Canal oficial de Hairy - Videos publicitarios y contenido exclusivo
              </p>
              
              <div className="flex items-center space-x-6 text-white">
                <div className="flex items-center space-x-1">
                  <i className="ri-user-line text-sm"></i>
                  <span className="text-sm font-semibold">
                    {channelInfo ? formatNumber(channelInfo.statistics.subscriberCount) : '1.2K'} suscriptores
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="ri-play-circle-line text-sm"></i>
                  <span className="text-sm">
                    {channelInfo ? formatNumber(channelInfo.statistics.videoCount) : videos.length} videos
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="ri-eye-line text-sm"></i>
                  <span className="text-sm">
                    {channelInfo ? formatNumber(channelInfo.statistics.viewCount) : '45.6K'} visualizaciones
                  </span>
                </div>
                {isDemoData && (
                  <div className="bg-orange-500/80 px-2 py-1 rounded text-xs font-bold">
                    DEMO
                  </div>
                )}
              </div>
            </div>
            
            <a
              href={`https://www.youtube.com/channel/UCl-jgo6w8UZwZTNVC7dxxAQ`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2 mt-4"
            >
              <i className="ri-youtube-line"></i>
              <span>Ver Canal</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navegación de pestañas */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'videos'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📹 Videos Publicados
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ℹ️ Acerca del Canal
          </button>
        </div>
      </div>

      {/* Contenido de las pestañas */}
      <div className="p-6">
        {activeTab === 'videos' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                🎬 Videos de Hairy ({videos.length})
              </h3>
              <button
                onClick={loadChannelData}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2"
              >
                <i className="ri-refresh-line"></i>
                <span>Actualizar</span>
              </button>
            </div>

            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video, index) => (
                  <div key={index} className="group cursor-pointer bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative">
                      <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video.contentDetails.duration)}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <i className="ri-play-circle-fill text-4xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                      </div>
                      
                      {/* Indicador de video publicitario */}
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        HAIRY
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors text-sm">
                        {video.snippet.title}
                      </h4>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <i className="ri-eye-line"></i>
                            <span>{formatNumber(video.statistics.viewCount)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <i className="ri-thumb-up-line"></i>
                            <span>{formatNumber(video.statistics.likeCount)}</span>
                          </div>
                        </div>
                        <span>{formatDate(video.snippet.publishedAt)}</span>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex space-x-2">
                        <a
                          href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap text-center"
                        >
                          Ver Video
                        </a>
                        <button
                          onClick={() => {
                            const shareUrl = `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;
                            navigator.clipboard.writeText(shareUrl);
                            alert('¡Enlace copiado al portapapeles!');
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-share-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-video-line text-2xl text-red-600"></i>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No hay videos aún</h4>
                <p className="text-gray-600 mb-4">Los videos que subas a YouTube aparecerán aquí automáticamente</p>
                <a
                  href="https://studio.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-upload-line"></i>
                  <span>Ir a YouTube Studio</span>
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📺 Acerca de Hairy Channel</h3>
              <p className="text-gray-700 leading-relaxed">
                Canal oficial de Hairy dedicado a contenido publicitario y promocional para PetStore. 
                Aquí encontrarás videos exclusivos sobre productos para mascotas, herramientas de IA, 
                y todo el contenido relacionado con el ecosistema de Hairy.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-user-line text-xl text-red-600"></i>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {channelInfo ? formatNumber(channelInfo.statistics.subscriberCount) : '1.2K'}
                </div>
                <div className="text-sm text-gray-600">Suscriptores</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-play-circle-line text-xl text-blue-600"></i>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {channelInfo ? formatNumber(channelInfo.statistics.videoCount) : videos.length}
                </div>
                <div className="text-sm text-gray-600">Videos</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-eye-line text-xl text-green-600"></i>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {channelInfo ? formatNumber(channelInfo.statistics.viewCount) : '45.6K'}
                </div>
                <div className="text-sm text-gray-600">Visualizaciones</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">🎯 Objetivos del Canal</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>Promocionar productos y servicios de PetStore</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>Mostrar las herramientas de IA de Hairy Tools</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>Crear contenido educativo sobre mascotas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-500"></i>
                  <span>Conectar con la comunidad de amantes de mascotas</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">🔗 Conecta con Hairy Channel</h4>
              <div className="flex items-center space-x-4">
                <a
                  href={`https://www.youtube.com/channel/UCl-jgo6w8UZwZTNVC7dxxAQ?sub_confirmation=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-youtube-line"></i>
                  <span>Suscribirse</span>
                </a>
                <a
                  href={`https://www.youtube.com/channel/UCl-jgo6w8UZwZTNVC7dxxAQ/videos`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-play-list-line"></i>
                  <span>Ver Todos los Videos</span>
                </a>
              </div>
            </div>

            {/* Información para administrador */}
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <i className="ri-information-line text-blue-600"></i>
                <span className="font-semibold text-blue-900">📤 ¿Cómo subir videos?</span>
              </div>
              <div className="text-sm text-blue-700 space-y-2">
                <p className="font-medium">Los videos que subas a YouTube aparecerán aquí automáticamente:</p>
                <div className="bg-white rounded p-3 space-y-2">
                  <p><strong>Opción 1 - YouTube Studio:</strong></p>
                  <a 
                    href="https://studio.youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline block"
                  >
                    → Ir a YouTube Studio
                  </a>
                  
                  <p className="mt-3"><strong>Opción 2 - YouTube Directo:</strong></p>
                  <a 
                    href="https://www.youtube.com/upload" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline block"
                  >
                    → Subir video en YouTube
                  </a>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  ✨ Una vez subido el video en YouTube, aparecerá automáticamente en esta sección
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
