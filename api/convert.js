import sharp from 'sharp';

// Configure Sharp for Vercel
process.env.SHARP_IGNORE_GLOBAL_LIBVIPS = '1';

export default async (req, res) => {
  try {
    // Get image buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Validate image
    if (buffer.length < 100) {
      return res.status(400).json({ error: "Invalid image file" });
    }

    // Process with Sharp (basic Ghibli effect)
    const processed = await sharp(buffer)
      .modulate({
        brightness: 1.1,
        saturation: 1.7
      })
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
