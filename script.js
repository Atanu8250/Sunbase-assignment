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
const formContainer = document.querySelector('.form-container');
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
     showToast('Save the form to get latest preview! ⚠️')
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
     fieldBox.dataset.id = field.id;
     fieldBox.draggable = true;

     fieldBox.addEventListener('dragstart', () => {
          fieldBox.classList.add('dragging');
     })

     fieldBox.addEventListener('dragend', () => {
          fieldBox.classList.remove('dragging');

          const draggedItemID = fieldBox.dataset.id;
          const afterElementID = fieldBox.nextSibling?.dataset.id;

          const draggedItemIndex = DefaultformData.findIndex(el => el.id === draggedItemID);
          const afterElementIndex = DefaultformData.findIndex(el => el.id === afterElementID);

          const [draggedItem] = DefaultformData.splice(draggedItemIndex, 1);
          if (afterElementID !== undefined) {
               if (draggedItemIndex < afterElementIndex) {
                    DefaultformData.splice(afterElementIndex - 1, 0, draggedItem);
               } else {
                    DefaultformData.splice(afterElementIndex, 0, draggedItem);
               }
          } else {
               DefaultformData.push(draggedItem);
          }
     })

     // Delete button 
     const deleteBtn = document.createElement('button');
     deleteBtn.classList.add('delete', 'field-action-btn');
     deleteBtn.onclick = deleteElement;

     const trashIcon = document.createElement('i');
     trashIcon.classList.add('fa-solid', 'fa-trash');

     deleteBtn.appendChild(trashIcon);
     fieldBox.appendChild(deleteBtn);

     const dragIcon = document.createElement('i');
     dragIcon.classList.add("fa-solid", "fa-grip-vertical", "drag-icon");
     fieldBox.appendChild(dragIcon);

     const fieldGroups = document.createElement('div');
     fieldGroups.style.width = `100%`;

     // First field group
     const fieldGroup1 = document.createElement('div');
     fieldGroup1.classList.add('field-group');

     const label1 = document.createElement('label');
     label1.classList.add('field-label');
     label1.textContent = `Enter ${field.type} label`;

     const input1 = document.createElement('input');
     input1.onchange = (e) => updateFormData(e, field.id, 'label');
     input1.type = 'text';
     input1.placeholder = `Enter ${field.type} label`;
     input1.classList.add('field');
     input1.value = field.label;

     fieldGroup1.appendChild(label1);
     fieldGroup1.appendChild(input1);
     fieldGroups.appendChild(fieldGroup1)

     // --- Second field group (placeholder) ---
     if (field.type !== 'checkbox') {
          const fieldGroup2 = document.createElement('div');
          fieldGroup2.classList.add('field-group');

          const label2 = document.createElement('label');
          label2.classList.add('field-label');

          fieldGroup2.appendChild(label2);

          if (field.type === 'input' || field.type === 'textarea') {
               const input2 = document.createElement('input');

               input2.onchange = (e) => updateFormData(e, field.id, 'placeholder');
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
               addOptionBtn.classList.add('add-option', 'btn', 'success')
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

          fieldGroups.appendChild(fieldGroup2);
     }
     fieldBox.appendChild(fieldGroups);

     return fieldBox;

}

function updateFormData(event, fieldId, keyType) {
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
               const fieldData = DefaultformData.find(f => f.id === field.id);
               if (fieldData) fieldData.options.splice(optInd, 1);

               // Remove the node from the DOM
               updateFormCanvas();
          };
          singleOption.append(option, close)
          optionsBox.appendChild(singleOption);
     })

     return optionsBox;
}

function updateFormCanvas(formData = DefaultformData) {
     if (formData.length <= 0) {
          formCanvas.classList.add('empty-state');
          formCanvas.innerHTML = `<h3>Component list is Empty, add few to edit!</h3>`;
          return;
     }

     formCanvas.innerHTML = '';
     formCanvas.classList.remove('empty-state');

     // Use fragment for Batch DOM update for better performance
     const fragment = document.createDocumentFragment();
     const formContainer = document.createElement('div')
     formContainer.classList.add('form-container');
     formContainer.innerHTML = '';

     formContainer.addEventListener('dragover', (e) => {
          e.preventDefault();

          const draggingItem = document.querySelector('.dragging');
          const afterElement = getDragAfterElement(formContainer, e.clientY);

          if (afterElement == null) {
               formContainer.appendChild(draggingItem);
          } else {
               formContainer.insertBefore(draggingItem, afterElement);
          }
     })

     formData.forEach((field) => {
          let fieldBox = renderFormElements(field);
          formContainer.appendChild(fieldBox);
     })

     fragment.appendChild(formContainer)
     formCanvas.appendChild(fragment);
}

function getDragAfterElement(container, y) {
     // determine all the elements of the container in which we are dragging over
     const draggableElements = [...container.querySelectorAll('[draggable]:not(.dragging)')];

     return draggableElements.reduce((closest, child) => {
          // get the box DOM-details where we are dropping the dragging elem
          const box = child.getBoundingClientRect();

          // offset  = mousePosition - center of the nearest draggable elem
          const offset = (y - (box.top + (box.height / 2)));

          if (offset < 0 && offset > closest.offset) {
               return { offset, element: child }
          } else return closest;

     }, { offset: Number.NEGATIVE_INFINITY }).element;
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
     showToast(`${element.type} added in the form!`);
}

function deleteElement(e) {
     const id = e.target.closest('.field-box').dataset.id;
     DefaultformData = DefaultformData.filter(field => field.id !== id);
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

function showToast(message) {
     const toastContainer = document.getElementById('toastContainer');
     const toastBox = document.createElement('p');
     toastBox.classList.add('toast-box');
     toastContainer.appendChild(toastBox);

     setTimeout(() => {
          toastBox.textContent = message;
          toastBox.classList.remove('hide');
          toastBox.classList.add('show');
     })

     setTimeout(() => {
          toastBox.classList.remove('show');
          toastBox.classList.add('hide');
     }, 2000);

     setTimeout(() => {
          toastContainer.removeChild(toastBox);
     },2301)
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
     console.log(JSON.stringify(DefaultformData, null, 2));
     showToast("Saved, Check the console!");
}

document.getElementById('copyHtmlBtn').onclick = () => {
     copyHTML();
     showToast('HTML copied in the clipboard!')
}


// Initial loads
setExistingTheme();

updateFormCanvas();

generateFormPreview();

