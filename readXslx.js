const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');

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
    
    case 'DIVINA': 
      incrementValues(2, 'Divina', row.LIQUIDO, row.BRUTO, 'Doctor');
      break;
    
    case 'CLESIO': 
      incrementValues(3, 'Clesio', row.LIQUIDO, row.BRUTO, 'Doctor');
      break;
    
    case 'SANT': 
      incrementValues(4, 'Sant', row.LIQUIDO, row.BRUTO, 'Doctor');
      break;
    
    case 'VALMIR': 
      incrementValues(5, 'Valmir', row.LIQUIDO, row.BRUTO, 'Doctor');
      break;
    
    case 'DOUGLAS': 
      incrementValues(6, 'Douglas', row.LIQUIDO, row.BRUTO, 'Doctor');
      break;
    
    case 'LUCIANO': 
      incrementValues(7, 'Luciano', row.LIQUIDO, row.BRUTO, 'Doctor');
      break;
    
    case 'CLAUDIO': 
      incrementValues(8, 'Claudio', row.LIQUIDO, row.BRUTO, 'Doctor');
      break;
    
    default: break;
  }
}

const filterArray = (arr) => {
  return arr.filter(element => element);
}

const formatString = (string) => {
  let formatedString = JSON.stringify(string);

  formatedString = formatedString.replace(/[{]/gm, '');
  formatedString = formatedString.replace(/[}]/gm, '');
  formatedString = formatedString.replace(/[:]/gm, ': ');
  formatedString = formatedString.replace(/["]/gm, ' ');

  return '\n  ' + formatedString ;
}

const data = async () => {
  await readXlsxFile('./planilha.xlsx', { schema })
  .then(({rows, err}) => {
    rows.map(row => {
      sumByDoc(row);
      sumByHealthInsurance(row);

    });
  }).catch(err => console.log(err));

  doctor = filterArray(doctor);
  healthInsurance = filterArray(healthInsurance);

  const result = `Médicos: ${doctor.map(val => formatString(val))}
  \nConvênio: ${healthInsurance.map(val => formatString(val))}`;

  fs.writeFile('valores.txt', result, (err) => {
    if (err) console.log(err);
  });
}

data();