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
]



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
     console.log(modal.style)
     modal.style.display = 'block';
}

function closePreview() {
     modal.style.display = 'none';
}

function renderFormElement(field, preview = false) {
     switch (field.type) {
          case 'input':
               return (
                    `<div class="field-box">
                         <div class="field-info">
                              <label for='${field.id}' class="field-label">${field.label}</label>

                              <span class="field-action-btns ${preview && 'hide'}">
                                   <button class="edit">
                                        <i class="edit fa-regular fa-pen-to-square"></i>
                                   </button>
                                   <button class="delete" onclick="deleteElement('${field.id}')">
                                        <i class="delete fa-solid fa-trash"></i>
                                   </button>
                              </span>
                         </div>
                         <input id='${field.id}' type="text" placeholder="${field.placeholder}" class="field" />
                    </div>`
               )

          case 'select':
               return (
                    `<div class="field-box">
                         <div class="field-info">
                              <label for='${field.id}' class="field-label">${field.label}</label>

                              <span class="field-action-btns ${preview && 'hide'}">
                                   <button class="edit">
                                        <i class="edit fa-regular fa-pen-to-square"></i>
                                   </button>
                                   <button class="delete" onclick="deleteElement('${field.id}')">
                                        <i class="delete fa-solid fa-trash"></i>
                                   </button>
                              </span>
                         </div>
                         <select id='${field.id}' class="field">
                              ${field.options.map(opt => `<option value="${opt.split(' ').join('-')}">${opt}</option>`).join('')}
                         </select>
                    </div>`
               )

          case 'textarea':
               return (
                    `<div class="field-box">
                         <div class="field-info">
                              <label for='${field.id}' class="field-label">${field.label}</label>

                              <span class="field-action-btns ${preview && 'hide'}">
                                   <button class="edit">
                                        <i class="edit fa-regular fa-pen-to-square"></i>
                                   </button>
                                   <button class="delete" onclick="deleteElement('${field.id}')">
                                        <i class="delete fa-solid fa-trash"></i>
                                   </button>
                              </span>
                         </div>
                         <textarea id='${field.id}' placeholder="${field.placeholder}" class="field"></textarea>
                    </div>`
               )

          case 'checkbox':
               return (
                    `<div class="field-box">
                         <div class="field-info">
                              <div class="checkbox">
                                   <input id='${field.id}' type="checkbox" class="checkbox-field" />
                                   <label for='${field.id}' class="field-label">${field.label}</label>
                              </div>

                              <span class="field-action-btns ${preview && 'hide'}">
                                   <button class="edit">
                                        <i class="edit fa-regular fa-pen-to-square"></i>
                                   </button>
                                   <button class="delete" onclick="deleteElement('${field.id}')">
                                        <i class="delete fa-solid fa-trash"></i>
                                   </button>
                              </span>
                         </div>
                    </div>`
               )

          default:
               return null;
     }
}

function updateFormCanvas(formData = DefaultformData) {
     if (formData.length <= 0) {
          formCanvas.classList.add('empty-state');
          formCanvas.innerHTML = `<h3>Add Components to check the preview here!</h3>`;

          previewForm.classList.add('empty-state');
          previewForm.innerHTML = `<h3>Add Components to check the preview here!</h3>`;

          return;
     }

     formCanvas.innerHTML = '';
     formCanvas.classList.remove('empty-state');
     previewForm.innerHTML = '';
     previewForm.classList.remove('empty-state');

     const formContainer = document.createElement('div')
     formContainer.classList.add('form-container');
     formContainer.innerHTML = '';

     formData.forEach((field) => {
          let fieldBox = renderFormElement(field);
          formContainer.innerHTML += fieldBox;

          let previewFieldBox = renderFormElement(field, true);
          previewForm.innerHTML += previewFieldBox;
     })

     formCanvas.appendChild(formContainer);
}

function generateUUID() {
     return `${Date.now().toString()}-${Math.random() * 9999}`
}

function addFormElement(type, label, placeholder, options) {
     const element = {
          id: generateUUID(),
          type,
          label,
     }

     if (type !== 'checkbox' && type !== 'select') element.placeholder = placeholder;

     if (type === 'select') element.options = options;

     console.log('DefaultformData:', DefaultformData)
     DefaultformData.push(element);
     updateFormCanvas();
}

function deleteElement(id) {
     let labels = document.querySelectorAll(`label[for='${id}']`);
     labels.forEach(label => label.closest('.field-box').remove())
     DefaultformData = DefaultformData.filter(form => form.id !== id);
     if (DefaultformData.length <= 0) updateFormCanvas();
}

function editElement() {

}

function copyHTML() {
     const html = previewForm.innerHTML;
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
          const item = header.parentElement;
          item.classList.toggle('expanded');
     })
})

componentForms.forEach(form => {
     form.addEventListener('submit', e => {
          e.preventDefault();

          const type = e.submitter.dataset.type;
          const labelInput = form.querySelector('.label-input').value || `Sample ${type.charAt(0).toUpperCase() + type.slice(1)}`;
          let placeholderORoptions = type !== 'checkbox' && form.querySelector('.placeholder-input').value;

          if (type === 'select') {
               const options = placeholderORoptions.split(',').map(opt => opt.trim()).filter(opt => opt);
               addFormElement(type, labelInput, placeholderORoptions, options.length ? options : ['Sample Option', 'Sample Option', 'Sample Option']);
          } else {
               addFormElement(type, labelInput, placeholderORoptions || 'Sample Placeholder');
          };


          form.reset();
          form.closest('.component-item').classList.remove('expanded');
     })

     form.querySelector('.cancel').addEventListener('click', () => {
          form.reset();
          form.closest('.component-item').classList.remove('expanded');
     })
})




setExistingTheme();

updateFormCanvas();


