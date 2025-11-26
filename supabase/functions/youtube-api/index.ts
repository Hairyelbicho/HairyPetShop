import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action')
    
    // Credenciales de YouTube API
    const YOUTUBE_API_KEY = 'AIzaSyDGOCSPX-IP3Uj-sK-ZmAy9qEGBuGAy0YpVtS'
    const CHANNEL_ID = 'UCl-jgo6w8UZwZTNVC7dxxAQ'

    switch (action) {
      case 'channel-info':
        return await getChannelInfo(YOUTUBE_API_KEY, CHANNEL_ID)
      
      case 'videos':
        const maxResults = url.searchParams.get('maxResults') || '10'
        return await getChannelVideos(YOUTUBE_API_KEY, CHANNEL_ID, maxResults)
      
      case 'statistics':
        return await getChannelStatistics(YOUTUBE_API_KEY, CHANNEL_ID)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action parameter' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
    }

  } catch (error) {
    console.error('YouTube API Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function getChannelInfo(apiKey: string, channelId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`
  )
  
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`)
  }
  
  const data = await response.json()
  
  return new Response(
    JSON.stringify({
      success: true,
      data: data.items[0] || null
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  )
}

async function getChannelVideos(apiKey: string, channelId: string, maxResults: string) {
  // Primero obtener el playlist ID de uploads
  const channelResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
  )
  
  if (!channelResponse.ok) {
    throw new Error(`YouTube API error: ${channelResponse.status}`)
  }
  
  const channelData = await channelResponse.json()
  const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads
  
  if (!uploadsPlaylistId) {
    throw new Error('No uploads playlist found')
  }
  
  // Obtener videos del playlist de uploads
  const videosResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`
  )
  
  if (!videosResponse.ok) {
    throw new Error(`YouTube API error: ${videosResponse.status}`)
  }
  
  const videosData = await videosResponse.json()
  
  // Obtener estadísticas de los videos
  const videoIds = videosData.items.map((item: any) => item.snippet.resourceId.videoId).join(',')
  
  const statsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${apiKey}`
  )
  
  const statsData = await statsResponse.json()
  
  // Combinar datos de videos con estadísticas
  const videosWithStats = videosData.items.map((video: any) => {
    const stats = statsData.items.find((stat: any) => stat.id === video.snippet.resourceId.videoId)
    return {
      ...video,
      statistics: stats?.statistics || {},
      contentDetails: stats?.contentDetails || {}
    }
  })
  
  return new Response(
    JSON.stringify({
      success: true,
      data: videosWithStats
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  )
}

async function getChannelStatistics(apiKey: string, channelId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
  )
  
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`)
  }
  
  const data = await response.json()
  
  return new Response(
    JSON.stringify({
      success: true,
      data: data.items[0]?.statistics || null
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  )
}