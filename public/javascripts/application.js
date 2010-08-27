(function() {
  var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  $(function() {
    var Stars, ajaxForm, saveDraft;
    $('a.resend').click(function() {
      var a;
      a = $(this);
      a.hide().after('<span>Resending&hellip;</span>');
      $.get(this.href, function() {
        return a.next('span').html('Sent!').fadeOut('slow', function() {
          a.next('span').remove();
          return a.fadeIn();
        });
      });
      return false;
    });
    $('a.delete').click(function() {
      return confirm('Are you sure?');
    });
    $('a.reveal').click(function() {
      $(this).hide().next('.hidden').slideDown(function() {
        return $(this).find('input').select();
      });
      return false;
    });
    $(':input:visible:first:not([rel=nofollow])').focus();
    $('input.url').click(function() {
      if (this.value === this.defaultValue) {
        return this.select();
      }
    });
    ajaxForm = function(form, options) {
      options.type = form.attr('method');
      options.url = form.attr('action');
      options.data = form.serialize();
      return $.ajax(options);
    };
    $('form.reset_password').submit(function() {
      var email, form;
      form = $(this);
      email = form.find('input.email').val();
      ajaxForm(form, {
        success: function(data) {
          return form.replaceWith("<h2>" + email + " has been sent a new password</h2>\n<p>It should arrive shortly.</p>");
        },
        error: function(xhr) {
          return $('#errors').append("<li>" + xhr.responseText + "</li>");
        }
      });
      return false;
    });
    $('form').submit(function(evt) {
      var errors, form, hasError, highlightError;
      form = $(this).closest('form');
      errors = $('#errors').html('');
      form.find('input').removeClass('error');
      hasError = false;
      highlightError = function(selector, message, fn) {
        var invalid;
        invalid = form.find(selector).filter(fn);
        if (invalid.length) {
          errors.append(("<li>" + (message) + "</li>"));
          invalid.addClass('error');
          invalid.blur();
          return (hasError = true);
        }
      };
      highlightError('input.email', 'Invalid email address', function() {
        var val;
        val = $(this).val();
        return val && !/^[a-zA-Z0-9+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(val);
      });
      highlightError('input[name=name]', 'Name is required', function() {
        return !$(this).val();
      });
      highlightError('input#github', 'GitHub username is required', function() {
        return !$(this).val();
      });
      highlightError('input.email:first', 'Email is required', function() {
        return !$(this).val();
      });
      highlightError('input[type=password]:visible', 'Password required', function() {
        return !$(this).val();
      });
      highlightError('input.url', 'Invalid link', function() {
        var val;
        val = $(this).val();
        return val && val !== this.defaultValue && !/^https?:\/\/.*\./.test(val);
      });
      !(hasError) ? $('input.url').each(function() {
        if (this.value === this.defaultValue) {
          return (this.value = '');
        }
      }) : null;
      return !hasError;
    });
    $('.body.index time:first').each(function() {
      var _a, countdown, d, h, i, m, s, start, tick, y;
      _a = $(this).attr('datetime').split(/[-:TZ]/);
      y = _a[0];
      m = _a[1];
      d = _a[2];
      h = _a[3];
      i = _a[4];
      s = _a[5];
      start = Date.UTC(y, m - 1, d, h, i, s);
      countdown = $('#date .countdown');
      tick = function() {
        var days, diff, hours, minutes, secs;
        diff = (start - new Date().getTime()) / 1000;
        if (diff <= 0) {
          return countdown.html("START CODING!");
        } else {
          days = Math.floor(diff % 604800 / 86400);
          hours = Math.floor(diff % 86400 / 3600);
          minutes = Math.floor(diff % 3600 / 60);
          secs = Math.floor(diff % 60);
          countdown.html((days > 0 ? days + ' day ' : '') + (hours > 0 ? hours + ' hours ' : '') + (minutes > 0 ? minutes + ' minutes ' : '') + secs + ' seconds');
          return setTimeout(tick, 1000);
        }
      };
      return tick();
    });
    $('.body.index time').live('hover', function(e) {
      var $this, _a, d, dt, h, i, m, ms, s, y;
      if (e.type === 'mouseout') {
        return $('.localtime').remove();
      }
      $this = $(this);
      _a = $this.attr('datetime').split(/[-:TZ]/);
      y = _a[0];
      m = _a[1];
      d = _a[2];
      h = _a[3];
      i = _a[4];
      s = _a[5];
      ms = Date.UTC(y, m - 1, d, h, i, s);
      dt = new Date(ms);
      return $('<div class="localtime blue">').css({
        left: e.pageX,
        top: $(this).position().top + 25
      }).html(("" + (dt.strftime('%a %b %d, %I:%M%P %Z').replace(/\b0/, '')))).appendTo(document.body);
    });
    $('.judge img').each(function() {
      var r;
      r = 'rotate(' + new String(Math.random() * 6 - 3) + 'deg)';
      return $(this).css('-webkit-transform', r).css('-moz-transform', r);
    });
    $('.application .deployed .more a').click(function() {
      $('.deploy').slideToggle('fast');
      return false;
    });
    Stars = {
      value: function(elem) {
        return elem.attr('data-value');
      },
      input: function(elem) {
        return elem.closest('.stars').prev('input[type=hidden]');
      },
      set: function(elem) {
        var newVal, oldVal;
        newVal = this.value(elem);
        oldVal = this.input(elem).val();
        return this.input(elem).val(newVal === oldVal ? 0 : newVal);
      },
      highlight: function(elem, hover) {
        var score;
        score = parseInt(hover ? this.value(elem) : this.input(elem).val());
        return elem.closest('.stars').children().each(function(i, star) {
          var $star, fill;
          $star = $(star);
          fill = $star.attr('data-value') <= score;
          $star.find('.filled').toggle(fill);
          return $star.find('.empty').toggle(!fill);
        });
      }
    };
    $('.votes-new, #your_vote').delegate('.star', 'hover', function(e) {
      return Stars.highlight($(this), e.type === 'mouseover');
    }).delegate('.star', 'click', function(e) {
      return Stars.set($(this));
    });
    (function() {
      $('.votes time').each(function() {
        var _a, d, h, i, m, ms, s, y;
        _a = $(this).attr('datetime').split(/[-:TZ]/);
        y = _a[0];
        m = _a[1];
        d = _a[2];
        h = _a[3];
        i = _a[4];
        s = _a[5];
        ms = Date.UTC(y, m - 1, d, h, i, s);
        return $(this).text(prettyDate(new Date(ms)));
      });
      return setTimeout(arguments.callee, 10 * 1000);
    })();
    $('.votes .more').each(function() {
      var $more, loadMoreNow, page;
      $more = $(this);
      loadMoreNow = $more.position().top - $(window).height() + 10;
      page = 1;
      return $(window).scroll(function(e) {
        if (loadMoreNow && this.scrollY > loadMoreNow) {
          loadMoreNow = null;
          return $.get(window.location.pathname + ("/votes.js?page=" + (++page)), function(html) {
            var moreVotes;
            moreVotes = $('<div class="page">').html(html);
            $more.remove();
            $('.votes').append(moreVotes);
            if (moreVotes.find('li').length === 51) {
              $('.votes').append($more);
              return (loadMoreNow = $more.position().top - $(window).height() + 10);
            }
          });
        }
      });
    });
    saveDraft = __bind(function(form) {
      var _a;
      if (!((typeof (_a = window.localStorage) !== "undefined" && _a !== null))) {
        return null;
      }
      return (localStorage['draft'] = JSON.stringify(form.serializeArray()));
    }, this);
    $('#your_vote a[href$=draft]').click(function() {
      return saveDraft($(this).closest('form'));
    });
    $('#your_vote').submit(function(e) {
      var $errors, $form;
      $form = $(this);
      $errors = $form.find('#errors');
      ajaxForm($form, {
        success: function(data) {
          return $('#your_vote .email_input').length ? window.location.reload() : $(data).prependTo('ul.votes').hide().next('li.header').remove().end().slideDown('fast');
        },
        error: function(xhr) {
          var email, errors, path;
          if (xhr.status === 403) {
            saveDraft($form);
            email = encodeURIComponent($form.find('#email').val());
            path = encodeURIComponent(window.location.pathname + '#save');
            return (window.location = ("/login?return_to=" + (path) + "&email=" + (email)));
          } else {
            errors = JSON.parse(xhr.responseText);
            return $errors.html(errors.map(function(error) {
              return "<li>" + (error) + "</li>";
            }).join("\n")).slideDown();
          }
        }
      });
      return false;
    });
    $('.teams-show #your_vote').each(function() {
      var _a, _b, _c, _d, _e, draft, el, hash;
      hash = window.location.hash;
      draft = (typeof (_a = window.localStorage == undefined ? undefined : window.localStorage.draft) !== "undefined" && _a !== null);
      try {
        if (!(draft && (hash === '#save' || hash === '#draft'))) {
          return null;
        }
        _b = []; _d = JSON.parse(draft);
        for (_c = 0, _e = _d.length; _c < _e; _c++) {
          el = _d[_c];
          _b.push($(this[el.name]).val(el.value));
        }
        return _b;
      } finally {
        delete localStorage.draft;
      }
    });
    return $('.votes-new .stars, #your_vote .stars').each(function() {
      return Stars.highlight($(this));
    });
  });
})();
