import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://ixagdnzuwqkkcuhrauqy.supabase.co'
const supabaseKey = 'sb_publishable_0JiafjsIJgWPZ4SUu2MpYw_zEDiLiTI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function insertData() {
  const data = JSON.parse(fs.readFileSync('scratch/migration_payload.json', 'utf8'))
  
  console.log(`Iniciando inserção de ${data.length} registros...`)
  
  const { error } = await supabase
    .from('base_registry')
    .insert(data)

  if (error) {
    console.error('Erro na migração:', error)
  } else {
    console.log('✅ Migração concluída com sucesso! Todos os dados estão no SaaS.')
  }
}

insertData()
