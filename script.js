$(document).ready(function() {
  // Function to request a word from server
  const getWord = () => {
    return $.ajax({
      method: "GET",
      url: "http://tom.mo2.dinksurveys.net/api/1.0/getWord?letters=5",
      dataType: "json"
    });
  };

  // Function to get a word, add letters to it, randomise order
  // and then render the letters on the page.
  const renderWord = () => {
    getWord().done(function(data) {
      $("#response").text("");
      $("#word").hide();
      $("#word").text(data.word);
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      data.word += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      data.word += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      let wordArray = data.word.split("");

      for (let i = wordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
      }
      $.each(wordArray, function(i, letter) {
        $(`#tileBottom${i}`).text(letter);
      });
    });
  };

  // Initial call to render word on page load
  renderWord();

  // Onclick funcionality for bottom row
  $(".tileBottom").click(function(e) {
    for (let i = 0; i < 7; ++i) {
      if ($(`#tileTop${i}`).text() === "") {
        $(`#tileTop${i}`).text(e.currentTarget.innerText);
        i += 8;
      }
    }
    e.currentTarget.innerText = "";
  });

  // Onclick functionality for top row
  $(".tileTop").click(function(e) {
    for (let i = 0; i < 7; ++i) {
      if ($(`#tileBottom${i}`).text() === "") {
        $(`#tileBottom${i}`).text(e.currentTarget.innerText);
        i += 8;
      }
    }
    e.currentTarget.innerText = "";
  });

  // Onclick functionality for new word button
  $("#newWord").click(function(e) {
    for (let i = 0; i < 7; ++i) {
      $(`#tileTop${i}`).text("");
    }
    renderWord();
  });

  // Onclick functionality for check answer button
  $("#checkAnswer").click(function(e) {
    let answer = "";
    for (let i = 0; i < 7; ++i) {
      answer += $(`#tileTop${i}`).text();
    }
    if (answer.length < 5) {
      $("#response").text("Try Again!");
    } else {
      $.ajax({
        method: "GET",
        url: `http://tom.mo2.dinksurveys.net/api/1.0/isword?word=${answer}`,
        dataType: "json"
      }).done(function(data) {
        if (data.isWord === false) {
          $("#response").text("Try Again!");
        } else {
          $("#response").text("Well Done!");
        }
      });
    }
  });

  // Onclick functionality for reveal word button
  $("#revealWord").click(function(e) {
    $("#word").show();
  });
});
