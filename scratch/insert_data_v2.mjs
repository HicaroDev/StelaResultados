import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://ixagdnzuwqkkcuhrauqy.supabase.co'
const supabaseKey = 'sb_publishable_0JiafjsIJgWPZ4SUu2MpYw_zEDiLiTI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function insertData() {
  const data = JSON.parse(fs.readFileSync('scratch/migration_final_payload.json', 'utf8'))
  
  console.log(`Iniciando inserção de ${data.length} registros (Lote 2)...`)
  
  const { error } = await supabase
    .from('base_registry')
    .insert(data)

  if (error) {
    console.error('Erro na migração:', error)
  } else {
    console.log('✅ Lote 2 migrado com sucesso! Ecossistema completo.')
  }
}

insertData()
