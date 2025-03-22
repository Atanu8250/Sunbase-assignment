// Catch elements
const toggleThemebtn = document.getElementById('themeToggle');
const previewBtn = document.getElementById('previewBtn');
const modal = document.getElementById('previewModal');
const modalContent = document.getElementById('modalContent');
const modalCloseBtn = document.querySelector('.close-btn');
const copyBtn = document.getElementById('copyHtmlBtn');
const componentHeaders = document.querySelectorAll('.component-header');
const componentForms = document.querySelectorAll('.component-form');
const formCanvas = document.getElementById('formCanvas');
const previewForm = document.getElementById('previewForm');



let DefaultformData = [
     {
          id: "c0ac49c5-871e-4c72-a878-251de465e6b4",
          type: "input",
          label: "Sample Input",
          placeholder: "Sample placeholder"
     },
     {
          id: "146e69c2-1630-4a27-9d0b-f09e463a66e4",
          type: "select",
          label: "Sample Select",
          options: ["Sample Option", "Sample Option", "Sample Option"]
     },
     {
          id: "45002ecf-85cf-4852-bc46-529f94a758f5",
          type: "textarea",
          label: "Sample Textarea",
          placeholder: "Sample Placeholder"
     },
     {
          id: "680cff8d-c7f9-40be-8767-e3d6ba420952",
          type: "checkbox",
          label: "Sample Checkbox",
     },
];



// ================ Declare functions ================
function setExistingTheme() {
     const savedTheme = localStorage.getItem('theme');
     if (savedTheme) setTheme(savedTheme);
     else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(prefersDark ? 'dark' : 'light');
     }
}

function setTheme(theme) {
     document.body.dataset.theme = theme;
     localStorage.setItem('theme', theme);
}

function showPreview() {
     // generateFormPreview();
     modal.style.display = 'block';
}

function closePreview() {
     modal.style.display = 'none';
}

function renderFormPreviewElement(field) {
     switch (field.type) {
          case 'input':
               return (
                    `<div class="preview-field-box">
                         <label for='${field.id}' class="preview-field-label">${field.label}</label>
                         <input id='${field.id}' type="text" placeholder="${field.placeholder}" class="preview-field" />
                    </div>`
               )

          case 'select':
               return (
                    `<div class="preview-field-box">
                         <label for='${field.id}' class="preview-field-label">${field.label}</label>
                         <select id='${field.id}' class="preview-field">
                              ${field.options.map(opt => `<option value="${opt.split(' ').join('-')}">${opt}</option>`).join('')}
                         </select>
                    </div>`
               )

          case 'textarea':
               return (
                    `<div class="preview-field-box">
                         <label for='${field.id}' class="preview-field-label">${field.label}</label>
                         <textarea id='${field.id}' placeholder="${field.placeholder}" class="preview-field"></textarea>
                    </div>`
               )

          case 'checkbox':
               return (
                    `<div class="preview-field-box">
                              <div class="preview-checkbox">
                                   <input id='${field.id}' type="checkbox" class="preview-checkbox-field" />
                                   <label for='${field.id}' class="preview-field-label">${field.label}</label>
                              </div>
                         </div>
                    </div>`
               )

          default:
               return null;
     }
}

function generateFormPreview() {
     previewForm.innerHTML = '';

     const form = document.createElement('form');
     form.innerHTML = DefaultformData.map(el => renderFormPreviewElement(el)).join("");
     previewForm.appendChild(form);
}

function renderFormElements(field) {
     // Create the main contianer
     const fieldBox = document.createElement('div');
     fieldBox.classList.add('field-box');

     // Delete button 
     const deleteBtn = document.createElement('button');
     deleteBtn.classList.add('delete', 'field-action-btn');
     deleteBtn.onclick = () => { deleteElement(field.id) };

     const trashIcon = document.createElement('i');
     trashIcon.classList.add('fa-solid', 'fa-trash');

     deleteBtn.appendChild(trashIcon);
     fieldBox.appendChild(deleteBtn);

     // First field group
     const fieldGroup1 = document.createElement('div');
     fieldGroup1.classList.add('field-group');

     const label1 = document.createElement('label');
     label1.classList.add('field-label');
     label1.textContent = `Enter ${field.type} label`;

     const input1 = document.createElement('input');
     input1.onchange = (e) => udpateFormData(e, field.id, 'label');
     input1.type = 'text';
     input1.placeholder = `Enter ${field.type} label`;
     input1.classList.add('field');
     input1.value = field.label;

     fieldGroup1.appendChild(label1);
     fieldGroup1.appendChild(input1);
     fieldBox.appendChild(fieldGroup1);

     // --- Second field group (placeholder) ---
     if (field.type !== 'checkbox') {
          const fieldGroup2 = document.createElement('div');
          fieldGroup2.classList.add('field-group');

          const label2 = document.createElement('label');
          label2.classList.add('field-label');

          fieldGroup2.appendChild(label2);

          if (field.type === 'input' || field.type === 'textarea') {
               const input2 = document.createElement('input');

               input2.onchange = (e) => udpateFormData(e, field.id, 'placeholder');
               input2.classList.add('field');

               label2.textContent = `Enter ${field.type} placeholder`;
               input2.placeholder = `Enter ${field.type} placeholder`;
               input2.type = 'text';
               input2.value = field.placeholder || field.options.join(", ");

               fieldGroup2.appendChild(input2);
          } else if (field.type === 'select') {
               label2.textContent = `Enter ${field.type} options`;

               let optionsBox = renderOptionFields(field);
               fieldGroup2.appendChild(optionsBox);

               const addOptionBtn = document.createElement('button');
               addOptionBtn.classList.add('add-option', 'btn')
               addOptionBtn.textContent = 'Add Option';
               addOptionBtn.onclick = () => {
                    // Form data udpate
                    DefaultformData.forEach(formData => {
                         if (formData.id === field.id) {
                              formData.options.push(`Sample Option`)
                         }
                         return formData;
                    })

                    // update DOM
                    updateFormCanvas()
               }
               fieldGroup2.appendChild(addOptionBtn)
          }


          fieldBox.appendChild(fieldGroup2);
     }

     return fieldBox;

}

function udpateFormData(event, fieldId, keyType) {
     const updatedValue = event.target.value;

     DefaultformData.forEach(formData => {
          if (formData.id === fieldId) {
               formData[keyType] = updatedValue;
          }
     })
}

function renderOptionFields(field) {
     const optionsBox = document.createElement('div');
     optionsBox.classList.add('multiple-options')
     optionsBox.innerHTML = '';

     field.options.forEach((opt, optInd, arr) => {
          const singleOption = document.createElement('div');
          singleOption.classList.add('option-box')

          const option = document.createElement('input');
          option.onchange = (e) => {
               const updatedValue = e.target.value;

               DefaultformData.forEach(formData => {
                    if (formData.id === field.id) {
                         formData.options[optInd] = updatedValue;
                    }
                    return formData;
               })
          }
          option.classList.add('field', 'option-field');
          option.type = 'text';
          option.value = opt;


          const close = document.createElement('button');
          close.classList.add('option-close')
          close.innerHTML = '<i class="fa-solid fa-close"></i>';
          close.onclick = (e) => {
               // Form data udpate
               DefaultformData.forEach(formData => {
                    if (formData.id === field.id) {
                         formData.options = formData.options.filter((_, i) => i !== optInd);
                    }
                    return formData;
               })
               // Remove the node from the DOM
               e.target.closest('div').remove();
          };
          singleOption.append(option, close)
          optionsBox.appendChild(singleOption);
     })

     return optionsBox;
}

function updateFormCanvas(formData = DefaultformData) {
     if (formData.length <= 0) {
          formCanvas.classList.add('empty-state');
          formCanvas.innerHTML = `<h3>Add Components to check the preview here!</h3>`;
          return;
     }

     formCanvas.innerHTML = '';
     formCanvas.classList.remove('empty-state');

     const formContainer = document.createElement('div')
     formContainer.classList.add('form-container');
     formContainer.innerHTML = '';

     formData.forEach((field) => {
          let fieldBox = renderFormElements(field);
          formContainer.appendChild(fieldBox);
     })

     formCanvas.appendChild(formContainer);
}

function addFormElement(formElementObj) {
     const element = {
          id: generateUUID(),
          type: formElementObj.type,
          label: formElementObj.label,
     }

     if (formElementObj.placeholder) element.placeholder = formElementObj.placeholder;

     if (formElementObj.options) element.options = formElementObj.options;

     DefaultformData.push(element);
     updateFormCanvas();
}

function deleteElement(id) {
     DefaultformData = DefaultformData.filter(form => form.id !== id);
     updateFormCanvas();
}

function generateUUID() {
     return `${Date.now().toString()}-${Math.random() * 9999}`
}

function generateFormHTML(html) {
     const container = document.createElement('div');
     container.innerHTML = html;

     // Remove all 'class' attributes
     container.querySelectorAll('[class]').forEach(el => el.removeAttribute('class'));

     return container.innerHTML;
}

function copyHTML() {
     const html = generateFormHTML(document.getElementById('previewForm').innerHTML);
     navigator.clipboard.writeText(html);
}


// ================ Add Event-Listeners ================
toggleThemebtn.addEventListener('click', () => {
     const existingTheme = document.body.getAttribute('data-theme');
     setTheme(existingTheme === 'dark' ? 'light' : 'dark');
});


previewBtn.addEventListener('click', showPreview);

modalCloseBtn.addEventListener('click', closePreview);

modal.addEventListener('click', closePreview);

// Prevent event-bubling 
modalContent.addEventListener('click', () => {
     event.stopPropagation();
})


componentHeaders.forEach(header => {
     header.addEventListener('click', () => {
          const formElementObj = {
               type: header.dataset.type,
               label: `Sample ${header.dataset.type.charAt(0).toUpperCase() + header.dataset.type.slice(1)}`,
          }

          if (formElementObj.type !== 'checkbox' || formElementObj.type !== 'select') {
               formElementObj.placeholder = 'Sample Placeholder'
          }

          if (formElementObj.type === 'select') {
               formElementObj.options = ['Sample Option', 'Sample Option', 'Sample Option']
          }

          addFormElement(formElementObj);
     })
})


document.getElementById('saveBtn').onclick = () => {
     generateFormPreview();
     console.log(JSON.stringify(DefaultformData));
}

document.getElementById('copyHtmlBtn').onclick = () => {
     copyHTML();
}




setExistingTheme();

updateFormCanvas();


