const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');
const { jsonToTableHtmlString } = require('json-table-converter')

const schema = require('./xlsxSchema');

let doctor = [];
let healthInsurance = [];

const incrementValues = (index, name, liquid, rough, type) => {
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

const filterArray = (arr) => arr.filter(element => element);

const data = async () => {
  await readXlsxFile('./planilha.xlsx', { schema })
  .then(({rows, err}) => {
    rows.map(row => {
      sumByDoc(row);
      sumByHealthInsurance(row);

    });
  }).catch(err => console.log(err));

  doctor = await jsonToTableHtmlString(filterArray(doctor));
  htmlDoc = `
    <!DOCTYPE html>
    <hmtl>
      <body>
        ${doctor}
      </body>
    </html>`
  
  healthInsurance = await jsonToTableHtmlString(filterArray(healthInsurance));
  htmlInsurance = `
    <!DOCTYPE html>
    <hmtl>
      <body>
        ${healthInsurance}
      </body>
    </html>`


  fs.writeFile('doutores.html', htmlDoc, (err) => {
    if (err) console.log(err);
  });
  fs.writeFile('convenios.html', htmlInsurance, (err) => {
    if (err) console.log(err);
  });
}

data();