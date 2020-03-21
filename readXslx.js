const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');
const { jsonToTableHtmlString } = require('json-table-converter')

const schema = require('./xlsxSchema');

let doctor = [];
let healthInsurance = [];
let docPercentage = [];

const incrementValues = (index, name, liquid, rough, type, percentage) => {
  switch (type) {
    case 'healthInsurance': {
      if(!healthInsurance[index]) healthInsurance[index] = { nome: name, liquido: liquid, bruto: rough };
      else {
        healthInsurance[index].liquido += liquid;
        healthInsurance[index].bruto += rough;
      }
      break;
    }
    case 'Doctor': {
      if(!doctor[index]) doctor[index] = { nome: name, liquido: liquid, bruto: rough };
      else {
        doctor[index].liquido += liquid;
        doctor[index].bruto += rough;
      }
      break;
    }

    case 'Percentage': {
      const getPercentage = (auxLiquid, auxPercentage) => (auxLiquid * auxPercentage);
      
      if(!docPercentage[index]) {
        docPercentage[index] = { nome: name, valor: getPercentage(liquid, percentage) };
      } else docPercentage[index].valor += getPercentage(liquid, percentage);
      
      break;
    }
  }
}

const sumByHealthInsurance = (row) => {
  switch (row['CONVÊNIO']) {
    case 'UNIMED': 
      incrementValues(0, 'Unimed', row.LIQUIDO, row.BRUTO, 'healthInsurance');
      break;
    
    case 'CASSI': 
      incrementValues(1, 'Cassi', row.LIQUIDO, row.BRUTO, 'healthInsurance');
      break;
    
    case 'HOSPITALAR': 
      incrementValues(2, 'Hospitalar', row.LIQUIDO, row.BRUTO, 'healthInsurance');
      break;
    
    case 'CAAPSML': 
      incrementValues(3, 'Caapsml', row.LIQUIDO, row.BRUTO, 'healthInsurance');
      break;
    
    case 'CAPSAUDE': 
      incrementValues(4, 'Cap saude', row.LIQUIDO, row.BRUTO, 'healthInsurance');
      break;
    
    case 'CAIXA': 
      incrementValues(5, 'Caixa', row.LIQUIDO, row.BRUTO, 'healthInsurance');
      break;
    
    case 'COPEL': 
      incrementValues(6, 'Copel', row.LIQUIDO, row.BRUTO, 'healthInsurance');
      break;
    
    case 'SANEPAR': 
      incrementValues(7, 'Sanepar', row.LIQUIDO, row.BRUTO, 'healthInsurance');
      break;
    
    case 'CASEMBRAPA': 
      incrementValues(8, 'Casembrapa', row.LIQUIDO, row.BRUTO, 'healthInsurance');
      break;
    
    case 'BRADESCO': 
      incrementValues(9, 'Bradesco', row.LIQUIDO, row.BRUTO, 'healthInsurance');
      break;
    
    case 'PROASA': 
      incrementValues(10, 'Proasa', row.LIQUIDO, row.BRUTO, 'healthInsurance');
      break;
    
    case 'ASSEFAZ': 
      incrementValues(11, 'Assefaz', row.LIQUIDO, row.BRUTO, 'healthInsurance');
      break;
    
    default: break;
  }
}

const sumByDoc = (row) => {
  switch (row['MÉDICO']) {
    case 'EUDES': 
      incrementValues(0, 'Eudes', row.LIQUIDO, row.BRUTO, 'Doctor');
      break;
    
    case 'KAREN': 
      incrementValues(1, 'Karen', row.LIQUIDO, row.BRUTO, 'Doctor');
      break;
    
    case 'CLESIO': 
      incrementValues(3, 'Clesio', row.LIQUIDO, row.BRUTO, 'Doctor');
      break;

    default: break;
  }
}

const sumByPercentage = (row) => {
  let filteredRow = row['SOLICITANTE'].toLowerCase()
  filteredRow = filteredRow.match(/[.](.*)/gm)[0];
  filteredRow = filteredRow.replace(/\s/gm, '');
  filteredRow = filteredRow.replace(/[.]/gm, '');

  switch (filteredRow) {
    case 'eudes': 
      incrementValues(0, 'Eudes', row.LIQUIDO, row.BRUTO, 'Percentage', 0);
      break;
    
    case 'karen': 
      incrementValues(1, 'Karen', row.LIQUIDO, row.BRUTO, 'Percentage', 0);
      break;
    
    case 'divina': 
      incrementValues(2, 'Divina', row.LIQUIDO, row.BRUTO, 'Percentage', 0.3);
      break;
    
    case 'clesio': 
      incrementValues(3, 'Clesio', row.LIQUIDO, row.BRUTO, 'Percentage', 0.3);
      break;
    
    case 'sant': 
      incrementValues(4, 'Sant', row.LIQUIDO, row.BRUTO, 'Percentage');
      break;
    
    case 'valmir': 
      incrementValues(5, 'Valmir', row.LIQUIDO, row.BRUTO, 'Percentage', 0.3);
      break;
    
    case 'douglas': 
      incrementValues(6, 'Douglas', row.LIQUIDO, row.BRUTO, 'Percentage', 0.1);
      break;
    
    case 'luciano': 
      incrementValues(7, 'Luciano', row.LIQUIDO, row.BRUTO, 'Percentage', 0.1);
      break;
    
    case 'claudio': 
      incrementValues(8, 'Claudio', row.LIQUIDO, row.BRUTO, 'Percentage', 0.3);
      break;
      
    case "sant'anna": 
      incrementValues(9, "Sant'anna", row.LIQUIDO, row.BRUTO, 'Percentage', 0.3);
      break;
    
    default: break;
  }
}

const filterArray = (arr) => arr.filter(element => element);

const writeFile = (file, type) => {
  fs.writeFile(file, type, (err) => {
    if (err) console.log(err);
  });
}

const generateHtml = async (array) => {
  const table = await jsonToTableHtmlString(filterArray(array))
  return (
    `<!DOCTYPE html>
    <hmtl>
      <body>
        ${table}
      </body>
    </html>`
  )
}

const data = async () => {
  await readXlsxFile('./planilha.xlsx', { schema })
  .then(({rows, err}) => {
    rows.map(row => {
      sumByDoc(row);
      sumByHealthInsurance(row);
      sumByPercentage(row);
    });
  }).catch(err => console.log(err));

  writeFile('doutores.html', await generateHtml(doctor));
  writeFile('convenios.html', await generateHtml(healthInsurance));
  writeFile('porcentagens.html', await generateHtml(docPercentage));
}

data();