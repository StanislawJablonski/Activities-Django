// Odczytywanie wartości z cookie
const getCookie = (name) => {
  const str = document.cookie.split('; ');
  const result = {};
  str.forEach(el => {
    const cur = el.split('=');
    result[cur[0]] = cur[1];
  })
  return result[name] ? result[name] : ''
}
function getWeekNumber() {
  var _date = new Date()
  var monthStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  monthStartDate = new Date(monthStartDate);
  var day = monthStartDate.getDay();
  var date = new Date(_date);
  date = date.getDate();
  return Math.ceil((date+ day-1)/ 7)-1;
}

function getMonthName(){
  const monthNumber = new Date().getMonth()
  const monthNames = ['Styczeń','Luty','Marzec','Kiwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień']
  return monthNames[monthNumber] || 'Błędny miesiąć'
}

function getWeekDayName(width,dayNumber){
  const daysNames = ['Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela']
  const daysNamesShort = ['Pn','Wt','Śr','Cz','Pt','Sb','Nd']
  return width >= 768 ? daysNames[dayNumber] : daysNamesShort[dayNumber]
}

function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export { 
    getCookie,
    getWeekNumber,
    getMonthName,
    getWeekDayName,
    convertRemToPixels

}