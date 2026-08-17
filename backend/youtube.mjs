const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCl-jgo6w8UZwZTNVC7dxxAQ';

export async function handleYoutube(url) {
  const action = url.searchParams.get('action');
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return {
      status: 200,
      body: {
        success: true,
        isDemoData: true,
        data: action === 'videos' ? [] : null,
        error: 'Falta YOUTUBE_API_KEY en backend/.env',
      },
    };
  }

  if (action === 'channel-info' || action === 'statistics') {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${CHANNEL_ID}&key=${apiKey}`,
    );
    if (!response.ok) {
      return { status: 400, body: { success: false, error: `YouTube API ${response.status}` } };
    }
    const data = await response.json();
    const item = data.items?.[0] || null;
    return {
      status: 200,
      body: { success: true, data: action === 'statistics' ? item?.statistics || null : item },
    };
  }

  if (action === 'videos') {
    const maxResults = url.searchParams.get('maxResults') || '10';
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${apiKey}`,
    );
    if (!channelResponse.ok) {
      return { status: 400, body: { success: false, error: `YouTube API ${channelResponse.status}` } };
    }
    const channelData = await channelResponse.json();
    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      return { status: 400, body: { success: false, error: 'No uploads playlist found' } };
    }
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`,
    );
    const videosData = await videosResponse.json();
    const videoIds = (videosData.items || []).map((item) => item.snippet.resourceId.videoId).join(',');
    let statsData = { items: [] };
    if (videoIds) {
      const statsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${apiKey}`,
      );
      statsData = await statsResponse.json();
    }
    const videosWithStats = (videosData.items || []).map((video) => {
      const stats = (statsData.items || []).find((stat) => stat.id === video.snippet.resourceId.videoId);
      return {
        ...video,
        statistics: stats?.statistics || {},
        contentDetails: stats?.contentDetails || {},
      };
    });
    return { status: 200, body: { success: true, data: videosWithStats } };
  }

  return { status: 400, body: { error: 'Invalid action parameter' } };
}
