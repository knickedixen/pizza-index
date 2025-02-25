import { createRoot } from 'react-dom/client'
import './index.css'
import DBLoader from './DBLoader.tsx'

createRoot(document.getElementById('root')!).render(
  <DBLoader />
)
