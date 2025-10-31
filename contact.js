const form = document.getElementById('form');
const fName = document.getElementById('f-name');
const lName = document.getElementById('l-name');
const email = document.getElementById('email');
const textarea = document.getElementById('textarea');
const phone = document.getElementById('P-number');

form.addEventListener('submit', e => {
    e.preventDefault();
    validateInputs();
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = "";
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const isValidPhone = (phone) => {
    const re = /^\d{8,12}$/;  // Only digits, 8-12 length
    return re.test(phone);
};

const validateInputs = () => {

    let isValid = true;

    const fNameValue = fName.value.trim();
    const lNameValue = lName.value.trim();
    const emailValue = email.value.trim();
    const textareaValue = textarea.value.trim();
    const phoneValue = phone.value.trim();
    // const subjectSelected = document.querySelector('input[name="subject"]:checked');
    // const subjectControl = document.querySelector('.subject');


    if (fNameValue === "") {
        setError(fName, 'First Name is required');
        isValid = false;
    } else if (fNameValue.length <= 2) {
        setError(fName, 'First Name must be more than 2 characters');
        isValid = false;
    } else {
        setSuccess(fName);
    }

    if (lNameValue === "") {
        setError(lName, 'Last Name is required');
        isValid = false;
    } else if (lNameValue.length <= 2) {
        setError(lName, 'Last Name must be more than 2 characters');
        isValid = false;
    } else {
        setSuccess(lName);
    }


    if (emailValue === "") {
        setError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
        isValid = false;
    } else {
        setSuccess(email);
    }

    if (textareaValue === "") {
        setError(textarea, 'Message is required');
        isValid = false;
    } else {
        setSuccess(textarea);
    }

    if (phoneValue === "") {
        setError(phone, 'Phone is required');
        isValid = false;
    } else if (!isValidPhone(phoneValue)) {
        setError(phone, 'Provide a valid phone number (8-12 digits)');
        isValid = false;
    } else {
        setSuccess(phone);
    }
    // if (!subjectSelected) {
    //     setError(subjectControl, 'Please select a subject');
    //     isValid = false;
    // } else {
    //     setSuccess(subjectControl);
    // }

    if (isValid) {
        messageSent.style.display = 'flex';
        form.reset();
        document.querySelectorAll('.input-control').forEach(control => {
            control.classList.remove('success', 'error');
        });
    }

};
doneButton.addEventListener('click', () => {
    messageSent.style.display = 'none';
});