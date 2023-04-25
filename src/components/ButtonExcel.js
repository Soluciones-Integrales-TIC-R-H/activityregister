import React from 'react'
import { cilCloudDownload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'
import ReactExport from 'react-export-excel'
import { nanoid } from 'nanoid'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelSheet
const ExcelColumn = ReactExport.ExcelColumn

// eslint-disable-next-line react/prop-types
const ExportButtonExcel = ({ data = [{}], titleBook = 'Reporte' }) => {
  const Columm = Object.keys(data[0])
  return (
    <>
      <ExcelFile
        element={
          <CButton color="success" className="text-white mb-2">
            <CIcon icon={cilCloudDownload} /> Exportar
          </CButton>
        }
        filename={titleBook}
      >
        <ExcelSheet data={data} name={'' + titleBook}>
          {Columm.map((element) => {
            return <ExcelColumn label={element} value={element} key={'btnExcel_' + nanoid()} />
          })}
        </ExcelSheet>
      </ExcelFile>
    </>
  )
}

export { ExportButtonExcel }
