'use strict';

/////////////// 
// BANKIST APP ---!!

/////////////////////////////////////////////////
// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-12-01T23:36:17.929Z',
    '2023-12-04T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Joey karl',
  movements: [3000, 400, 205, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-12-01T23:36:17.929Z',
    '2023-12-04T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};


const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const usernameLabel = document.getElementById("validation");
const pinLabel = document.getElementById("pin")
const logoutLabel = document.querySelector(".Logout-Para");

//container
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerCreateAcc = document.querySelector(".Create-Acc");
const  containerIntro = document.querySelector(".Intro")
const containerSignUp = document.querySelector(".signup-Container");

//btn element
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnCreateAcc = document.querySelector(".Create-Account");

//input element
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



///Functions!!!
//Date Implement (1)
const formatDates = function(date,locale){

  const calDiffDate = (date1,date2) =>
  (Math.round(Math.abs(date2-date1))/(1000 * 60 * 60 * 24));
  const daysPassed = Math.round(calDiffDate(new Date(), date));
  
if(daysPassed==0) return `Today`;
if(daysPassed ==1) return `Yesterday`;
if(daysPassed <=7) return `${Math.round(daysPassed)} days ago`;
else{
 return new Intl.DateTimeFormat(locale).format(date);
}};


//Format Currency (2)
const FormatCurr = function(value,locale,currency){
return new Intl.NumberFormat(locale,{style:"currency", currency: currency}).format(value);
}



///
//----(To Display Transactions)----

const DisplayTrans = function(acc, sort = false){

//sorting
const movs = sort? acc.movements.slice().sort((a,b) => a-b) :  acc.movements;

movs.forEach(function(val,i){
   
    
//Date
const dates = new Date(acc.movementsDates[i]);
const displayDate = formatDates(dates,(navigator.language));


    const W_or_D = val < 0 ? "withdrawal":"deposit";

    const html = `
    <div class="movements__row">

     <div class="movements__type movements__type--${W_or_D}">${i+1} - ${W_or_D}</div>

     <div class="movements__date">${displayDate}
     </div>

     <div class="movements__value">${FormatCurr(val,"en-US","INR")}</div>

    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin",html);
  });
}


//Sort button
let sort= false;

btnSort.addEventListener("click", function(e){
  e.preventDefault();

  DisplayTrans(currentAccount, !sort);
  sort = !sort;
}); 


//----(Computing Usernames!)----

const CreateUserNames = function(accounts){
  accounts.forEach((acc)=>{
    acc.userName =acc.owner.toLowerCase().split(" ").map(function(num){
     return num[0];
    }).join("");
  });
};
CreateUserNames(accounts);
console.log(accounts);



//----(UI UPDATE)----
const updateUI = function(acc){
  
   //Balance Display
   DisplayBalance(acc);
   //Summay Display
   DisplaySummary(acc)
   //Transactions Display
   DisplayTrans(acc);
}


//----(CALC BALANCE)----
const DisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,val)=>
  acc+val ,0);
  labelBalance.textContent = FormatCurr(acc.balance,"en-US","INR");
}


//----(SUMMARY IMPLEMENT)----
const DisplaySummary = function(acc){

  const income = acc.movements.filter(val => val>0).reduce((acc,val) =>
      acc+val,0);
      labelSumIn.textContent=FormatCurr(income,"en-US","INR");

  const outcome = acc.movements.filter(val => val<0).reduce((acc,val) =>
      acc+val,0);
      labelSumOut.textContent = FormatCurr(outcome,"en-US","INR") ;

  const interest = acc.movements.filter(num => num>0).map(num => num*(acc.interestRate)/100).filter(val => val>=1).reduce((acc,val) => acc+val);
      labelSumInterest.textContent= FormatCurr(interest,"en-US","INR");
}




//----(LOGIN IMPLEMENT)----

let currentAccount;

//btn action
btnLogin.addEventListener("click",function(e){
e.preventDefault();
LogOutTimer();
//Date-Time API
const now = new Date();
const options = {
  hour:"numeric",
  minute:"numeric",
  day:"numeric",
  month:"long",
  year:"numeric"
};
const locale = navigator.language;
console.log(locale)
labelDate.textContent = new Intl.DateTimeFormat(locale,options).format(now);

//Checking Inputs
currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value) 
console.log(currentAccount);

if(currentAccount?.pin === Number(inputLoginPin.value)){
  
logoutLabel.innerHTML=`<a style="text-decoration: none; color: black;" href="/PROJECTS !!/MoneyEase/index.html" >LOGOUT</a>`;
containerSignUp.innerHTML=``;
btnCreateAcc.style.opacity=0;
containerIntro.style.opacity=0;
containerSignUp.style.opacity=0;

  // Display UI
  let html1 = `<p>Welcome Back, <span class="Span1">${currentAccount.owner.split(' ')[0]}</span></p>`
  labelWelcome.innerHTML = html1;

   containerApp.style.opacity = 100; 

   //To Clear input fields
   inputLoginUsername.value = inputLoginPin.value ="";

   updateUI(currentAccount);
}
else{
  alert("Wrong user Name or Password!");
  inputLoginUsername.value = inputLoginPin.value ="";
}
})



//----(Transfering Curr!)----
btnTransfer.addEventListener("click",function(event){ event.preventDefault();

  
const inputPinVal = document.querySelector(".CrtPin");
const amount2 = Number(inputTransferAmount.value);
const recieverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);

//Checking the Entered acc is crt or not
if(amount2>0 &&
  currentAccount.balance >= amount2 && 
  recieverAcc.userName 
 !== currentAccount.userName){
  
  if(Number(inputPinVal.value) === currentAccount.pin){


//Doing Transactions
currentAccount.movements.push(-amount2);
recieverAcc.movements.push(amount2);

//Transferring Date

currentAccount.movementsDates.push(new Date().toISOString());
recieverAcc.movementsDates.push(new Date().toISOString());

//ui update
updateUI(currentAccount);

  }
  else{
    alert("Invalid Pin!!")
  }
}else{
    alert("Don't Enter Amount Greater than the Blance! or Enter a valid Receiver Account!")
  }
  
inputTransferTo.value ="";
inputTransferAmount.value ="";
inputPinVal.value  = "";
})



//----(LOAN FEATURE)----

btnLoan.addEventListener("click", function(e){
  e.preventDefault();

  const amount = Math.floor(Number(inputLoanAmount.value));

  if(amount >0 && currentAccount.movements.some(val => val >= amount*0.1)){

setTimeout(function(){

  //Movements
  currentAccount.movements.push(amount);
  currentAccount.movementsDates.push(new Date().toISOString());
  updateUI(currentAccount);

  inputLoanAmount.value = "";


},2500);
  
  }
});


//close account
btnClose.addEventListener("click",function(e){
  e.preventDefault();
  containerIntro.style.opacity=100;
  labelWelcome.textContent="Login to get started";

  if(inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin){
const index = accounts.findIndex(acc =>
  acc.userName = currentAccount.userName);

  accounts.splice(index,1);
  containerApp.style.opacity = 0;
  labelWelcome.innerHTML = "Log in to get started";

}
inputCloseUsername.value = Number(inputClosePin.value) = 0;
})



//Movements UI
labelBalance.addEventListener("click",function(){

  const MovementsUI = Array.from(document.querySelectorAll(".movements__value"), 
  
  sbl =>
  Number(sbl.textContent.replace("€",""))
  );


  console.log(MovementsUI);

})


// Total Deposit and Withdrawal
const bankDepositSum = accounts.map(acc =>
acc.movements).flat().filter(acc => acc>0).reduce((sum,num)=> sum+num,0);
console.log(bankDepositSum);

const bankWithdrawalSum = accounts.map(acc =>
  acc.movements).flat().filter(acc => acc<0).reduce((sum,num)=> sum+num,0);
console.log(Math.trunc(bankWithdrawalSum));

 labelBalance.addEventListener("click",function(){
  containerCreateAcc.style.opacity = 0;

 
  [...document.querySelectorAll(".movements__row")].forEach((row,i) =>
  {
  if(i%2 == 0){
   row.style.backgroundColor = "#dee2e6"
  }
}
  );
 });



 //Logout Timer
 const LogOutTimer = function(){

  //5min
  let time = 300;

  //callTimer every sec
  const timer1=  setInterval(() => {
    let min = String(Math.trunc(time/60)).padStart(2,0);
    let sec = String(time%60)

    labelTimer.textContent = `${min}:${sec}`;
     time = time-1


     //ClearTimeOut

if(time === 0){
  clearInterval(timer1);
  labelWelcome.textContent="Log in to get started";
  containerApp.style.opacity=0;
  logoutLabel.innerHTML=``;
} }, 1000);
 };

 //CreateAcc - SignUp Form
 btnCreateAcc.addEventListener("click",function(e){
  e.preventDefault();

  containerIntro.style.opacity=0;
  containerSignUp.innerHTML=`
  
<div style=" position: relative; 
left: 0; 
right: 0; 
margin-left: auto; 
margin-right: auto; 
margin-top: 10%;
display: flex; align-items: center; justify-content: center;" >
  

<div id="login-form-wrap" style="background-color:rgb(209, 209, 209); padding: 70px; border-radius: 20px;  " class="Create-Acc-Form">
  <h2 style="font-size:xx-large; margin-left: 95px; font-family:Arial, Helvetica, sans-serif; ">Sign Up</h2>
  <form id="login-form">
    <p>
    <input type="text" id="username" name="username" placeholder="Username" required style="padding: 10px; margin-top: 20px; font-size: 20px; margin-left: 25px;"><i class="validation"><span></span><span></span></i>
    </p>
    <p>
    <input type="password" id="pin" name="email" placeholder="Pin" required style="padding: 10px; margin-top: 20px; margin-left: 25px; font-size: 20px;"><i class="validation"><span></span><span></span></i>
    </p>
    <p>
    <input type="submit" id="login" value="Create Account" style="padding: 10px; margin-top: 25px; margin-bottom: 20px; background-color: rgb(180, 180, 180); color: black; border-radius: 5px; margin-left: 25px; padding-left: 90px; padding-right: 90px;" class="SubmitRegister">
    </p>
  </form>

  <div id="create-account-wrap" style="display: flex;align-items: center; justify-content: center; margin-left: 20px;">
   <form action="/PROJECTS !!/MoneyEase/index.html">
    <p style="font-size: 20px; margin-top: 15px;">Complete Sign up to <button type="submit" style="background-color: rgb(209, 209, 209);font-size: 20px; color: rgb(29, 29, 98);    border-style: none; text-decoration: underline;"> Redirect</button></p>
    
   </form>
  </div>

</div>
</div>`

 })


 /////////////////////////////////////////////////////////
