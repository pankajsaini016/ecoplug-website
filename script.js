// =========================================================
// EcoPlug — site interactions
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- mobile nav toggle (all pages) ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  /* ---------- homepage-only interactive hero ---------- */
  var hero = document.getElementById('hero');
  if (!hero) return; // not on the homepage, stop here

  var activateBtn = document.getElementById('activateBtn');
  var whatIsBtn = document.getElementById('whatIsBtn');
  var dialogBackdrop = document.getElementById('dialogBackdrop');
  var dialogClose = document.getElementById('dialogClose');
  var dialogActivate = document.getElementById('dialogActivate');
  var eyebrowText = document.getElementById('eyebrowText');
  var heroHeadline = document.getElementById('heroHeadline');
  var heroSub = document.getElementById('heroSub');
  var toggleNote = document.getElementById('toggleNote');
  var savingReadout = document.getElementById('savingReadout');
  var ticker = document.getElementById('ticker');
  var tickerNum = document.getElementById('tickerNum');

  var solarActive = false;
  var savingInterval = null;
  var tickerInterval = null;

  function openDialog() {
    dialogBackdrop.classList.add('open');
  }
  function closeDialog() {
    dialogBackdrop.classList.remove('open');
  }

  function activateSolar() {
    if (solarActive) return;
    solarActive = true;

    hero.classList.add('is-solar');
    eyebrowText.textContent = 'Running on sunlight';
    heroHeadline.textContent = "That's what your roof could be doing right now.";
    heroSub.textContent = "Panels, EV charger, and a live savings estimate — this is a preview of a real EcoPlug install, sized to an average home.";
    toggleNote.textContent = 'This is a preview. A real quote is based on your roof and your bills.';
    activateBtn.textContent = 'Solar mode is on';
    activateBtn.disabled = true;
    activateBtn.style.opacity = '0.7';
    activateBtn.style.cursor = 'default';

    // animate the savings readout counting up to an estimated monthly saving
    setTimeout(function () {
      var target = 2400;
      var startTime = null;
      var duration = 1200;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var current = Math.floor(progress * target);
        savingReadout.textContent = '₹' + current.toLocaleString('en-IN');
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          savingReadout.textContent = '₹' + target.toLocaleString('en-IN') + '/mo';
        }
      }
      requestAnimationFrame(step);
    }, 900);

    // show the persistent bottom-left ticker and keep it climbing gently
    setTimeout(function () {
      ticker.classList.add('show');
      var kwh = 0;
      tickerInterval = setInterval(function () {
        kwh += 1;
        tickerNum.textContent = kwh + ' kWh';
      }, 4000);
    }, 1800);
  }

  activateBtn.addEventListener('click', activateSolar);
  whatIsBtn.addEventListener('click', openDialog);
  dialogClose.addEventListener('click', closeDialog);
  dialogActivate.addEventListener('click', function () {
    closeDialog();
    activateSolar();
    hero.scrollIntoView({ behavior: 'smooth' });
  });
  dialogBackdrop.addEventListener('click', function (e) {
    if (e.target === dialogBackdrop) closeDialog();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDialog();
  });

});

/* ---------- contact form: build a mailto with the entered details ---------- */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('leadForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var interest = document.getElementById('interest').value;
    var bill = document.getElementById('bill').value;
    var message = document.getElementById('message').value;

    var subject = encodeURIComponent('New enquiry: ' + name);
    var body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Phone: ' + phone + '\n' +
      'Interested in: ' + interest + '\n' +
      'Approx. monthly bill: ' + bill + '\n' +
      'Message: ' + message
    );
    window.location.href = 'mailto:hello@ecoplug.example?subject=' + subject + '&body=' + body;
  });
});
