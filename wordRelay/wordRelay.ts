const word = document.createElement('div');
word.textContent = '제로초';
document.body.append(word);
const form = document.createElement('form');
document.body.append(form);
const input = document.createElement('input');
form.append(input);
const button = document.createElement('button');
button.textContent = '입력!';
form.append(button);
const resultDiv = document.createElement('div');
document.body.append(resultDiv);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (word.textContent[word.textContent.length - 1] === input.value[0]) { // input.value === 초밥
    resultDiv.textContent = '딩동댕';
    word.textContent = input.value;
    input.value = '';
    input.focus();
  } else {
    resultDiv.textContent = '땡';
    input.value = '';
    input.focus();
  }
});
