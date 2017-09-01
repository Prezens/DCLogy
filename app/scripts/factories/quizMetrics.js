"use strict";

(function () {
  angular.module("dclogyApp").factory("quizMetrics", function QuizMetrics(DataService) {
    var quizObj = {
      hide: false,
      resultsActive: false,
      changeState: changeState,
      correctAnswers: [],
      markQuiz: markQuiz,
      numCorrect: 0
    };

    return quizObj;

    function changeState(metric, state) {
      if (metric === "quiz"){
        quizObj.hide = state;
      } else if (metric === "results"){
        quizObj.resultsActive = state;
      } else {
        return false;
      }
    }

    function markQuiz() {
      quizObj.correctAnswers = DataService.correctAnswers;
      var dataQuiz = DataService.quizQuestion;

      for (var i = 0; i < dataQuiz.length; i++){
        if (dataQuiz[i].selected === DataService.correctAnswers[i]){
          dataQuiz[i].correct = true;
          quizObj.numCorrect++;
        }else{
          dataQuiz[i].correct = false;
        }
      }
    }

    QuizMetrics.$inject = ['DataService'];
  });
})();
