const form          = document.getElementById('form');
const fName         = document.getElementById('f-name');
const lName         = document.getElementById('l-name');
const email         = document.getElementById('email');
const textareaEl    = document.getElementById('textarea');
const phone         = document.getElementById('P-number');

let contactBox;      // .contact-container
let messageSent;     // .Message-Sent
let doneButton;      // #done-button

/* -------------------------------------------------
   Helper functions
   ------------------------------------------------- */
const setError = (el, msg) => {
    const ctrl = el.parentElement;
    const err  = ctrl.querySelector('.error');
    err.innerText = msg;
    ctrl.classList.add('error');
    ctrl.classList.remove('success');
};

const setSuccess = (el) => {
    const ctrl = el.parentElement;
    const err  = ctrl.querySelector('.error');
    err.innerText = '';
    ctrl.classList.add('success');
    ctrl.classList.remove('error');
};

const isValidEmail = (val) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(val).toLowerCase());
};

const isValidPhone = (val) => /^\d{8,12}$/.test(val);

/* -------------------------------------------------
   Validation – returns true only if everything is OK
   ------------------------------------------------- */
const validateInputs = () => {
    let ok = true;

    const f = fName.value.trim(),
          l = lName.value.trim(),
          e = email.value.trim(),
          m = textareaEl.value.trim(),
          p = phone.value.trim();

    // First name
    if (!f) { setError(fName, 'First Name is required'); ok = false; }
    else if (f.length <= 2) { setError(fName, 'First Name must be > 2 chars'); ok = false; }
    else setSuccess(fName);

    // Last name
    if (!l) { setError(lName, 'Last Name is required'); ok = false; }
    else if (l.length <= 2) { setError(lName, 'Last Name must be > 2 chars'); ok = false; }
    else setSuccess(lName);

    // Email
    if (!e) { setError(email, 'Email is required'); ok = false; }
    else if (!isValidEmail(e)) { setError(email, 'Provide a valid email'); ok = false; }
    else setSuccess(email);

    // Message
    if (!m) { setError(textareaEl, 'Message is required'); ok = false; }
    else setSuccess(textareaEl);

    // Phone
    if (!p) { setError(phone, 'Phone is required'); ok = false; }
    else if (!isValidPhone(p)) { setError(phone, 'Phone: 8-12 digits only'); ok = false; }
    else setSuccess(phone);

    return ok;
};

/* -------------------------------------------------
   DOM ready – grab the containers & attach events
   ------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    contactBox  = document.querySelector('.contact-container');
    messageSent = document.querySelector('.Message-Sent');
    doneButton  = document.getElementById('done-button');

    /* ---- Form submit ---- */
    form.addEventListener('submit', e => {
        e.preventDefault();

        if (validateInputs()) {
            // 1. Hide the whole contact form
            contactBox.style.display = 'none';

            // 2. Show the success modal
            messageSent.style.display = 'flex';

            // 3. Reset everything
            form.reset();
            document.querySelectorAll('.input-control')
                    .forEach(c => c.classList.remove('success', 'error'));
        }
    });

    /* ---- Done button ---- */
    doneButton.addEventListener('click', () => {
        // 1. Hide modal
        messageSent.style.display = 'none';
        contactBox.style.display = 'flex';   
        window.location.href = 'index.html';
    });
});