import Audio2TextJS from 'audio2textjs';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const converter = new Audio2TextJS({
  model: 'base', // Configure the Whisper model here
});

export const transcribeAudio = async (buffer: Buffer, mimetype: string): Promise<string> => {
  const fileExtension = mimetype.split('/')[1] || 'webm';
  const tempFileName = `${uuidv4()}.${fileExtension}`;
  const tempFilePath = path.join('/tmp', tempFileName);

  try {
    // Save the audio buffer to a temporary file
    await fs.promises.writeFile(tempFilePath, buffer);
    
    // Use the audio2textjs library to transcribe
    const result = await converter.runWhisper(tempFilePath);
    
    if (!result.success) {
      throw new Error(result.message || 'Transcription failed.');
    }
    
    // Clean up the temporary file
    await fs.promises.unlink(tempFilePath);
    
    return result.output;
  } catch (error) {
    // Ensure the temporary file is deleted even if an error occurs
    if (fs.existsSync(tempFilePath)) {
      await fs.promises.unlink(tempFilePath).catch(err => console.error(err));
    }
    
    console.error("Transcription with audio2textjs failed:", error);
    throw new Error("Failed to transcribe audio for evaluation.");
  }
};