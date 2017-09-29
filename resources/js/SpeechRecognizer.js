var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
showInfo('info_start');



if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    start_button.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        console.log("in Start")
        recognizing = true;
        start_img.src = '/resources/img/mic-animate.gif';

        
    };

    recognition.onerror = function (event) {
        console.log(event.error);
        if (event.error == 'no-speech') {
            start_img.src = '/resources/img/mic.gif';
            showInfo('info_no_speech');
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            start_img.src = '/resources/img/mic.gif';
            showInfo('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                showInfo('info_blocked');
            } else {
                showInfo('info_denied');
            }
            ignore_onend = true;
        }
    };

    recognition.onend = function () {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        start_img.src = '/resources/img/mic.gif';
        if (!final_transcript) {
            showInfo('info_start');
            return;
        }
        showInfo('');
        
    };

    recognition.onresult = function (event) {

        var interim_transcript = '';
        if (typeof(event.results) == 'undefined') {
            recognition.onend = null;
            recognition.stop();
            upgrade();
            return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }

        final_transcript = capitalize(final_transcript);
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
    };
}

function upgrade() {
    start_button.style.visibility = 'hidden';
    showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function (m) {
        return m.toUpperCase();
    });
}


function startButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = 'en-IN';
	
    recognition.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    start_timestamp = event.timeStamp;
	window.setTimeout(sendFinalTranscriptToServer, 10000);

}

function showInfo(s) {
    if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id == s ? 'inline' : 'none';
            }
        }
        info.style.visibility = 'visible';
    } else {
        info.style.visibility = 'hidden';
    }
}

function sendFinalTranscriptToServer() {
    if(recognizing){
        recognition.stop();
    }
	var searchQuery = encodeURIComponent(final_transcript);
	
	
	 $.ajax({	
		url: "http://52CQYX1J:8080/search/?q="+searchQuery,
		method: "GET",
		
		success: function(result){
            console.log(JSON.stringify(result));
			createUrlsTable(result);
		},
		error: function(xhr, ajaxOptions, thrownError) {
			console.log(thrownError);
		}
	});
	
}