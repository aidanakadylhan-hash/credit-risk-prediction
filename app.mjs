import {predict} from './predict.mjs';
const status = document.querySelector('#status');
const form = document.querySelector('#form');
const names = {LIMIT_BAL:'Credit limit',SEX:'Sex code',EDUCATION:'Education code',MARRIAGE:'Marriage code',AGE:'Age (years)',PAY_0:'September repayment status',PAY_2:'August repayment status',PAY_3:'July repayment status',PAY_4:'June repayment status',PAY_5:'May repayment status',PAY_6:'April repayment status'};
try {
  const response = await fetch('./model.json');
  if (!response.ok) throw new Error('Model download failed. Please reload.');
  const model = await response.json();
  const groups = [ ['Account and demographics',model.schema.slice(0,5)], ['Repayment status',model.schema.slice(5,11)], ['Bill amounts',model.schema.slice(11,17)], ['Payment amounts',model.schema.slice(17)] ];
  for (const [title,fields] of groups) {
    const heading = document.createElement('h2'); heading.textContent = title;
    document.querySelector('#fields').append(heading);
    if (title === 'Repayment status') {
      const hint=document.createElement('p');hint.textContent='Preserved dataset codes: −2, −1, and 0 are separate categories; positive codes indicate months of delay.';document.querySelector('#fields').append(hint);
    }
    const grid=document.createElement('div');grid.className='grid';
    for (const field of fields) {
      const label=document.createElement('label');label.textContent=names[field.name] || field.name;
      const input=document.createElement(field.type==='category' ? 'select':'input');
      input.name=field.name; input.id=field.name;input.required=true;
      if (field.type==='category') {
        for (const value of field.choices) {const option=document.createElement('option');option.value=value;option.textContent=value;input.append(option);}
      } else {input.type='number';input.step='1';if(field.min!==null)input.min=field.min;if(field.max!==null && field.max!==undefined)input.max=field.max;}
      label.append(input);grid.append(label);
    }
    document.querySelector('#fields').append(grid);
  }
  function example(){for(const [name,value] of Object.entries(model.example))form.elements.namedItem(name).value=value;document.querySelector('#result').hidden=true;}
  document.querySelector('#example').addEventListener('click',example);
  example();
  document.querySelector('#metrics').textContent=Object.entries(model.metrics).map(([name,value])=>`${name.replaceAll('_',' ')} ${(value*100).toFixed(2)}%`).join(' · ');
  document.querySelector('#version').textContent=`Model version ${model.version}. Training clients: ${model.provenance.train_rows.toLocaleString()}.`;
  form.addEventListener('submit',event=>{
    event.preventDefault();
    try {
      const result=predict(model,Object.fromEntries(new FormData(form)));
      document.querySelector('#score').textContent=`${(result.score*100).toFixed(2)}% estimated default score`;
      document.querySelector('#flag').textContent=result.flag ? 'Default flag at threshold 0.50' : 'Below the default flag threshold of 0.50';
      document.querySelector('#result').hidden=false;status.textContent='';
    } catch(error) {document.querySelector('#result').hidden=true;status.textContent=error.message;}
  });
  status.textContent=''; form.hidden=false;
} catch(error) {status.textContent=`Unable to load the application. ${error.message}`;}
