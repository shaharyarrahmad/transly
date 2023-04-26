import axios from 'axios';
import { KVNamespace } from '@cloudflare/workers-types';
const API_BASE_URL = 'https://api.assemblyai.com/v2';
const API_KEY = process.env.ASSEMBLYAI_API_KEY;

export default defineEventHandler(async (event) => {
  const AudioBucket: KVNamespace = event.context.cloudflare.env.AudioBucket;
    // upload event file to cloudflare
    const audioFile = await readBody(event);
    // const audioFileName = audioFile.name;
    const audioFileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const audioFileBuffer = await audioFile.arrayBuffer();
    await AudioBucket.put(audioFileName, audioFile);
    return { data: audioFileName };
    // const file = await readBody(event);
    // try {
    //   const response = await axios.post(`${API_BASE_URL}/upload`, file, {
    //     headers: {
    //       'authorization': API_KEY,
    //       'Transfer-Encoding': 'chunked',
    //     },
    //   });
    //   const responseData = await response.data;
    //   console.log('responseData', responseData.upload_url);
      // return  {data: responseData.upload_url};
    // } catch (error) {
    //   return { status: 500, body: { message: 'Error uploading file' } };
    // }
  });
