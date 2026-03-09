const semesterClasses = {

"Operating System":60,
"Data Communication and networking":60,
"Design and Analysis of Algorithm":60,
"Understanding Harmony and Ethical Human Conduct":30,
"Aptitude Proficiency":40,
"Fundamentals of Cyber Security":40,
"Programming Skills with Data Structures":60,
"Python Programming":60,
"Theory of Computation":50

};


/* GREETING SYSTEM */

function updateGreeting(){

const now=new Date();
const hour=now.getHours();

let greeting;
let message;

if(hour<12){

greeting="☀️ Good Morning, Shaurya";
message="Let's protect that attendance today.";

}

else if(hour<17){

greeting="⚡ Good Afternoon, Shaurya";
message="Hope classes are going smooth.";

}

else if(hour<21){

greeting="🌙 Good Evening, Shaurya";
message="Hope attendance is staying strong.";

}

else{

greeting="🌌 Still coding, Shaurya?";
message="Late night productivity detected.";

}

document.getElementById("greeting").innerHTML=
greeting+"<br><span style='font-size:16px;color:#94a3b8'>"+message+"</span>";

}

updateGreeting();



/* CLOCK */

function updateClock(){

const now=new Date();

const time=now.toLocaleTimeString();
const date=now.toLocaleDateString();

document.getElementById("clock").innerText=
"🕒 Current Time: "+date+" • "+time;

}

setInterval(updateClock,1000);
updateClock();



/* ATTENDANCE DASHBOARD */

fetch("attendance.json")
.then(response=>response.json())
.then(data=>{

document.getElementById("lastUpdate").innerText=
"📊 Attendance Updated: "+data.last_updated;

const subjects=data.subjects;

const container=document.getElementById("subjectsContainer");

subjects.forEach(subject=>{

const theoryTotal=subject.theory_total||0;
const theoryAttended=subject.theory_attended||0;

const labTotal=subject.lab_total||0;
const labAttended=subject.lab_attended||0;

const totalConducted=theoryTotal+labTotal;
const totalAttended=theoryAttended+labAttended;

const percentage=((totalAttended/totalConducted)*100).toFixed(2);

const totalSemester=semesterClasses[subject.subject]||totalConducted;

const required=Math.ceil(totalSemester*0.75);
const maxBunk=totalSemester-required;

const missed=totalConducted-totalAttended;

const safeBunks=maxBunk-missed;


/* NEXT CLASS PREDICTION */

const nextMiss=((totalAttended)/(totalConducted+1)*100).toFixed(2);
const nextAttend=((totalAttended+1)/(totalConducted+1)*100).toFixed(2);


/* RISK SYSTEM */

let riskClass="safe";
let riskText="✅ Safe Zone";

if(percentage<85 && percentage>=75){

riskClass="warn";
riskText="⚠ Be careful with bunking";

}

if(percentage<75){

riskClass="danger";
riskText="❌ Attendance below 75%";

}


/* PROGRESS BAR COLOR */

let progressColor="#22c55e";

if(percentage<85) progressColor="#fbbf24";
if(percentage<75) progressColor="#ef4444";


const card=document.createElement("div");
card.className="card";

card.innerHTML=`

<h3>${subject.subject}</h3>

Theory: ${theoryAttended} / ${theoryTotal} (${theoryTotal?((theoryAttended/theoryTotal)*100).toFixed(2):100}%)
<br>
Lab: ${labAttended} / ${labTotal} (${labTotal?((labAttended/labTotal)*100).toFixed(2):100}%)

<br><br>

Total: ${totalAttended} / ${totalConducted}

<div class="progress-bar">
<div class="progress" style="width:${percentage}%;background:${progressColor}"></div>
</div>

Attendance: ${percentage}% <br>

Safe Bunks Left: ${safeBunks>=0?safeBunks:0}

<br><br>

If you miss next class → ${nextMiss}% <br>
If you attend next class → ${nextAttend}%

<br><br>

<div class="${riskClass}">
${riskText}
</div>

`;

container.appendChild(card);

});

});


/* AUTO REFRESH EVERY 5 MINUTES */

setInterval(()=>{

location.reload();

},300000);