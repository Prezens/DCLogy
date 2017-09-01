"use strict";

(function () {
  angular.module("dclogyApp", []).controller("listCtrl", function list($scope, DataService, quizMetrics) {
    $scope.dataPerson = DataService.personsDC;
    $scope.quizMetrics = quizMetrics;

    $scope.activePerson = {};
    $scope.changeActivePerson = changeActivePerson;
    $scope.startQuiz = startQuiz;

    function changeActivePerson(index) {
      $scope.activePerson = index;
    }

    function startQuiz() {
      quizMetrics.changeState("quiz", true);
    }

    list.$inject = ['quizMetrics', 'DataService'];

  }).controller("quizCtrl", function quiz($scope, quizMetrics, DataService) {
    $scope.quizMetrics = quizMetrics;
    $scope.dataService = DataService.quizQuestion;
    $scope.activeQuestion = 0;
    $scope.error = false;
    $scope.finalise = false;

    $scope.setActiveQuestion = setActiveQuestion;
    $scope.questionAnswered = questionAnswered;
    $scope.selectAnswer = selectAnswer;
    $scope.finaliseAnswers = finaliseAnswers;

    var numQuestion = 0;

    function setActiveQuestion(index) {
      if (index === undefined){
        var breakOut = false;
        var quizLength = DataService.quizQuestion.length - 1;

        while (!breakOut){
          $scope.activeQuestion = $scope.activeQuestion < quizLength ? ++$scope.activeQuestion : 0;

          if ($scope.activeQuestion === 0){
            $scope.error = true;
          }

          if (DataService.quizQuestion[$scope.activeQuestion].selected === null){
            breakOut = true;

          }
        }
      }else {
        $scope.activeQuestion = index;
      }
    }

    function questionAnswered() {
      var quizLength = DataService.quizQuestion.length;

      if (DataService.quizQuestion[$scope.activeQuestion].selected !== null){
        numQuestion++;
        if(numQuestion >= quizLength){
          for(var i = 0; i < quizLength; i++){
            if (DataService.quizQuestion[i].selected === null){
              setActiveQuestion(i);
              return;
            }
          }
          $scope.error = false;
          $scope.finalise = true;
          return;
        }
      }

      $scope.setActiveQuestion();
    }

    function selectAnswer(index) {
      DataService.quizQuestion[$scope.activeQuestion].selected = index;
    }

    function finaliseAnswers() {
      $scope.finalise = false;
      numQuestion = 0;
      $scope.activeQuestion = 0;
      quizMetrics.markQuiz();
      quizMetrics.changeState("quiz", false);
      quizMetrics.changeState("results", true);
    }

    quiz.$inject = ['quizMetrics', 'DataService'];
  }).controller("resultsCtrl", function results($scope, quizMetrics, DataService) {
    $scope.quizMetrics = quizMetrics;
    $scope.dataServiceQuiz = DataService.quizQuestion;
    $scope.dataService = DataService;
    $scope.activeQuestion = 0;

    $scope.calculatePerc = calculatePerc;
    $scope.getAnswerClass = getAnswerClass;
    $scope.setActiveQuestion = setActiveQuestion;
    $scope.resetQuiz = resetQuiz;

    function resetQuiz() {
      quizMetrics.changeState("results", false);
      quizMetrics.numCorrect = 0;

      for (var i = 0; i < DataService.quizQuestion.length; i++){
        var data = DataService.quizQuestion[i];
        data.selected = null;
        data.correct = null;
      }
    }

    function calculatePerc() {
      return quizMetrics.numCorrect / DataService.quizQuestion.length * 100;
    }

    function getAnswerClass(index){
      if(index === quizMetrics.correctAnswers[$scope.activeQuestion]){
        return 'bg-success';
      }else if(index === DataService.quizQuestion[$scope.activeQuestion].selected){
        return 'bg-danger';
      }
    }

    function setActiveQuestion(index) {
      $scope.activeQuestion = index;
    }

    results.$inject = ['quizMetrics', 'DataService'];
  });
})();
