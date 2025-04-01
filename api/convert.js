import sharp from 'sharp';

// Fix for Vercel
process.env.SHARP_IGNORE_GLOBAL_LIBVIPS = '1';

export default async (req, res) => {
  try {
    // Get image buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Validate
    if (buffer.length < 100) {
      return res.status(400).json({ error: "Invalid image file" });
    }

    // Ghibli effect pipeline
    const processed = await sharp(buffer)
      .modulate({
        brightness: 1.1,
        saturation: 1.8,
        hue: 15
      })
      .blur(0.4)
      .jpeg({ quality: 90 })
      .toBuffer();

    res.status(200).json({
      url: `data:image/jpeg;base64,${processed.toString('base64')}`
    });

  } catch (error) {
    console.error('Backend Error:', error);
    res.status(500).json({ 
      error: "Conversion failed",
      details: error.message 
    });
  }
};
