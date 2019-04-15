<template>
  <div>
    <b-alert show variant="dark">{{ this.index + 1}}. {{ this.questionText }}</b-alert>
    <b-list-group>
        <b-list-group-item 
        button 
        :key="answer.id" 
        v-for="answer in this.shuffledAnswers"
        @click="answerSelected(answer)"
        :variant="selectedAnswer !== null && selectedAnswer.id === answer.id ? 'primary' : ''"
        :disabled="answerSubmitted"
        :class="[displayAnswerResult(answer)]"
        >
        {{ answer.text }}
        </b-list-group-item>
    </b-list-group>

    <b-button 
    v-if="!answerSubmitted"
    :disabled="selectedAnswer === null" 
    class="mt-2" 
    variant="outline-primary"
    @click="submitAnswer"
    >
    Submit
    </b-button>

    <b-button 
    v-if="!answerSubmitted"
    class="mt-2 ml-2" 
    variant="outline-warning"
    @click="skipAnswer"
    >
    Skip
    </b-button>

    <b-button 
    v-if="answerSubmitted"
    class="mt-2" 
    variant="outline-success"
    @click="nextQuestion"
    >
    Next Question
    </b-button>
    <hr class="d-block d-md-none" />
  </div>
</template>

<script>
import { uuid } from 'vue-uuid';

export default {
    props: {
        currentQuestion: Object,
        index: Number,
        isLoading: Number,
    },
    data: function(){
        return {
            selectedAnswer: null,
            shuffledAnswers: [],
            answerSubmitted: false
        };
    },
    watch: {
        currentQuestion: {
            immediate: true,
            handler() {
                this.answerSubmitted = false;
                this.selectedAnswer = null;
                this.shuffle();
            }
        }
    },
    methods: {
        shuffle: function() {
            let array = [...this.answers];
            let counter = array.length;
            while (counter > 0) {
                let index = Math.floor(Math.random() * counter);
                counter--;
                let temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            this.shuffledAnswers = array;
        },
        answerSelected: function(answer){
            this.selectedAnswer = answer;
        },
        submitAnswer: function(){
            this.answerSubmitted = true;
            this.$emit('questionEnded', this.selectedAnswer.correct);
        },
        skipAnswer: function(){
            this.$emit('questionEnded', 2);
        },
        nextQuestion: function(){
            this.$emit('questionEnded', 3);
        },
        displayAnswerResult: function(answer){
            let answerClass = '';
            if(this.answerSubmitted){
                answerClass = this.selectedAnswer.id === answer.id && answer.correct === 1 ? 'correct' : 
                this.selectedAnswer.id === answer.id && answer.correct === 0 ? 'incorrect' :
                answer.correct === 1 ? 'correct' : '';
            }
            return answerClass;
        }
    },
    computed: {
        questionText: function(){
            if(this.currentQuestion !== undefined &&
            this.currentQuestion.question !== null){
                return atob(this.currentQuestion.question);
            } else {
                return 'Loading...';
            }
        },
        answers: function() {
            let answers = [];

            for(let i in this.currentQuestion.incorrect_answers){
                answers.push({
                    id: uuid.v1(),
                    text: atob(this.currentQuestion.incorrect_answers[i]),
                    correct: 0,
                });
            }

            answers.push({
                id: uuid.v1(),
                text: atob(this.currentQuestion.correct_answer),
                correct: 1
            });

            return answers;
        }
    }
}
</script>

<style scoped>
    .correct {
        background-color: lightgreen !important;
    }
    .incorrect {
        background-color: lightcoral !important;;
    }
</style>
