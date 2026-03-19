import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function uploadImages() {
  const imageDir = './public/product-images'
  
  if (!fs.existsSync(imageDir)) {
    console.error('❌ Directory not found:', imageDir)
    return
  }

  const files = fs.readdirSync(imageDir).filter(f => /\.(jpg|jpeg|png|svg|webp)$/i.test(f))
  
  if (files.length === 0) {
    console.error('❌ No images found in ./public/product-images')
    return
  }

  console.log(`📤 Uploading ${files.length} images...\n`)
  
  for (const file of files) {
    const filePath = path.join(imageDir, file)
    const fileBuffer = fs.readFileSync(filePath)
    
    // Determine content type
    const ext = path.extname(file).toLowerCase()
    const contentType = ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`
    
    const { error } = await supabase.storage
      .from('product-images')
      .upload(`${file}`, fileBuffer, { 
        upsert: true,
        contentType: contentType
      })
    
    if (error) {
      console.log(`  ✗ ${file}: ${error.message}`)
    } else {
      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${file}`
      console.log(`  ✓ ${file}`)
      console.log(`    URL: ${publicUrl}\n`)
    }
  }
  
  console.log('✅ Upload complete!')
}

uploadImages().catch(console.error)
