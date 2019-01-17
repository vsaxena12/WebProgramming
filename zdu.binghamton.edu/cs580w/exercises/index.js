'use strict';

$(function() {

  const CONTENT = '#exercise';
  const CHOICE = '.choices li p';
  const ANS = 'ans';
  const INFO = '_info';

  function doQuestion(json, isAnswer=false) {
    const base = location.pathname.replace(new RegExp(`${json.path}$`), '');
    $(CONTENT).html(`<div id="question">${json.question.html}</div>`);
    const up = location.href.replace(/[^\/]+$/, '');
    $(CONTENT).prepend(`<p><a href="${up}">Up</a></p>`);
    $("#question").prepend(`<h2>${json.title}</h2>`);
    $('p:first', $('.choices li')).
      prepend(i => `<input value=${i} name="${ANS}" type="radio">`);
    const preSelect = json.answer ? json.answer[ANS] : 0;
    $(`${CHOICE} input[value=${preSelect}]`).prop('checked', true);
    $('#question').wrap('<form id="form" method="GET"></form>');
    const params = json.question.params.replace(/\"/g, '&quot;');
    $('#form').append(`<input type="hidden" name="params" value="${params}">`);
    $('#question').append('<div id="buttons"></div>');
    $('#buttons').append('<button id="previous">Previous</button>');
    if (isAnswer) {
      $('#buttons').append('<button id="repeat">Repeat</button>');
      setLinkForm(base, $('#repeat'), json.path);
    }
    else {
      $('#buttons').append('<button id="submit">Submit</button>');
    }
    $('#buttons').append('<button id="next">Next</button>');
    setLinkForm(base, $('#previous'), json.previous);
    setLinkForm(base, $('#next'), json.next);
  }

  function setLinkForm(base, $button, path) {
    if (path) {
      const loc = window.location;
      const link = `${loc.protocol}//${loc.host}${base}${path}`;
      $button.wrap(`<form class="button-form" action="${link}"></form>`);
      $button.prop('type', 'submit');
    }
    else {
      $button.prop('disabled', true);
    }
  }

  function doAnswer(json) {
    doQuestion(json, true);
    $(CONTENT).append(`<div id="answer">${json.answer.html}</div>`);
    const {ans, okAns} = json.answer;
    $(`${CHOICE} input[value=${okAns}]`).closest('li').addClass('correct');
    if (ans !== okAns) {
      $(`${CHOICE} input[value=${ans}]`).closest('li').addClass('incorrect');
    }
  }

  function doMeta(json) {
    $(CONTENT).append(`<h2>${json.title}</h2>`);
    const up = location.href.replace(/[^\/]+\/?$/, '');
    $(CONTENT).append(`<p><a href="${up}">Up</a></p>`);
    $(CONTENT).append(`<p><strong>Topics</strong></p>`);
    for (const nested of json.nested) {
      const {id, title, isMeta} = nested;
      const trailSlash = (isMeta) ? '/' : '';
      $(CONTENT).append(`<p><a href="${id}${trailSlash}">${title}</a></p>`);
    }
  }

  function handle(json) {
    if (json.error) {
      location.href = location.href.replace(/\/exercises\/.*$/, '/exercises/');
    }
    else if (json.isMeta) {
      doMeta(json);
    }
    else if (json.answer) {
      doAnswer(json);
    }
    else {
      doQuestion(json);
    }
  }

  function fetchInfo() {
    const c = (location.search.length > 1) ? '&' : '?';
    const href = location.href.replace(/\?$/, '');
    fetch(`${href}${c}${INFO}=1`)
      .then(response => response.json())
      .then(json => handle(json))
      .then(() => MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'exercise']));
  }

  fetchInfo();
  
});
