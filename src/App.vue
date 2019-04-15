<template>
  <div id="app">
    <Header
      :isLoading="isLoading"
      :questionsCategories="questionsCategories"
      :questionCategorySelected="questionCategorySelected"
    />
    <b-container class="mt-3 mb-5" v-if="!this.quizDone">
      <b-row>
        <b-col cols="12" md="8" lg="9" xl="9">
          <b-progress :max="this.questions.length" class="mb-3">
            <b-progress-bar :value="this.index + 1">
              <strong>{{ this.index + 1 }} / {{ this.questions.length }}</strong>
            </b-progress-bar>
          </b-progress>
          <div v-if="this.isLoading === 0">
            <QuestionBox
              class="mt-3"
              :currentQuestion="this.questions[this.index]"
              :index="this.index"
              @questionEnded="this.questionEnded"
            />
          </div>
          <div v-else-if="this.isLoading === 1">
            <div class="text-center mt-3 mb-3">
              <h3>Loading Questions, Please wait...</h3>
              <br>
              <b-spinner></b-spinner>
            </div>
          </div>
          <div v-else-if="this.isLoading === 2">
            <div class="text-center mt-3 mb-3">
              <h3>Server Error, please try again.</h3>
              <br>
            </div>
          </div>
        </b-col>
        <b-col cols="12 mb-3" md="4" lg="3" xl="3">
          <h4>Score</h4>
          <b-table stacked :fields="scoreFields" striped :items="scoreList"></b-table>
          Powered By: <a href="https://opentdb.com/api_config.php">Open Trivia DB</a>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="mt-3" v-else>
      <b-jumbotron bg-variant="info" text-variant="white" border-variant="dark">
        <template slot="header">Quiz completed!</template>
        <template slot="lead">No more questions avaialble.</template>
        <hr class="my-4">
        <p>Final Score is: {{this.scoreList[0].correct}}/{{this.index - 1}}</p>
        <p>Select a different category from the menu to start again.</p>
      </b-jumbotron>
    </b-container>
  </div>
</template>

<script>
//import { uuid } from 'vue-uuid';
import Header from "./components/Header.vue";
import QuestionBox from "./components/QuestionBox.vue";

export default {
  name: "app",
  components: {
    Header,
    QuestionBox
  },
  methods: {
    nextQuestion: function() {
      this.index++;
      if (this.questions.length === this.index) {
        this.loadData();
      }
    },
    loadData: function() {
      this.isLoading = 1;
      fetch(this.getUrl(), {
        method: "get"
      })
        .then(resp => resp.json())
        .then(jsonData => {
          this.isLoading = 0;
          const currentQuestionsCount = this.questions.length;
          for (let i in jsonData.results) {
            if (!this.questionExists(jsonData.results[i])) {
              this.questions.push(jsonData.results[i]);
            }
          }

          if (this.questions.length === currentQuestionsCount) {
            this.quizDone = true;
          }
        })
        .catch(function(error) {
          this.isLoading = 2;
          console.log(error);
        });
    },
    questionExists: function(qObject) {
      for (let i in this.questions) {
        if (qObject.question === this.questions[i].question) {
          return true;
        }
      }
      return false;
    },
    getUrl: function() {
      return `${this.url}?amount=${
        this.questionsCount
      }&category=${this.getSelectedCategoryId()}&type=${
        this.questionsTypes
      }&encode=base64`;
    },
    getSelectedCategoriesTitles: function() {
      for (let i in this.questionsCategories) {
        if (this.questionsCategories[i].selected) {
          return this.questionsCategories[i].title;
        }
      }
    },
    getSelectedCategoryId: function() {
      for (let i in this.questionsCategories) {
        if (this.questionsCategories[i].selected) {
          return this.questionsCategories[i].id;
        }
      }
    },
    questionCategorySelected: function(categoryId) {
      for (let i in this.questionsCategories) {
        if (this.questionsCategories[i].id === categoryId) {
          this.questionsCategories[i].selected = true;
        } else {
          this.questionsCategories[i].selected = false;
        }
      }
      this.quizDone = false;
      this.index = 0;
      this.questions = [];
      this.scoreList[0].correct = 0;
      this.scoreList[0].inCorrect = 0;
      this.scoreList[0].skipped = 0;
      this.scoreList[0].questionsViewed = 0;
      this.loadData();
    },
    questionEnded: function(answerStatus) {
      if (answerStatus === 1) {
        this.scoreList[0].correct++;
      } else if (answerStatus === 0) {
        this.scoreList[0].inCorrect++;
      } else if (answerStatus === 2) {
        this.scoreList[0].skipped++;
        this.nextQuestion();
      } else if (answerStatus === 3) {
        this.nextQuestion();
      }
      this.scoreList[0].questionsViewed = this.index + 1;
    }
  },
  filters: {},
  computed: {},
  data: function() {
    return {
      questions: [],
      index: 0,
      isLoading: 1,
      url: "https://opentdb.com/api.php",
      questionsCategories: [
        {
          id: 9,
          title: "General Knowledge",
          selected: true
        },
        {
          id: 10,
          title: "Entertainment: Books",
          selected: false
        },
        {
          id: 11,
          title: "Entertainment: Film",
          selected: false
        },
        {
          id: 12,
          title: "Entertainment: Music",
          selected: false
        },
        {
          id: 13,
          title: "Entertainment: Musicals & Theatres",
          selected: false
        },
        {
          id: 14,
          title: "Entertainment: Television",
          selected: false
        },
        {
          id: 15,
          title: "Entertainment: Video Games",
          selected: false
        },
        {
          id: 16,
          title: "Entertainment: Board Games",
          selected: false
        },
        {
          id: 17,
          title: "Science & Nature",
          selected: false
        },
        {
          id: 18,
          title: "Science: Computers",
          selected: false
        },
        {
          id: 19,
          title: "Science: Mathematics",
          selected: false
        },
        {
          id: 20,
          title: "Mythology",
          selected: false
        },
        {
          id: 21,
          title: "Sports",
          selected: false
        },
        {
          id: 22,
          title: "Geography",
          selected: false
        },
        {
          id: 23,
          title: "History",
          selected: false
        },
        {
          id: 24,
          title: "Politics",
          selected: false
        },
        {
          id: 25,
          title: "Art",
          selected: false
        },
        {
          id: 26,
          title: "Celebrities",
          selected: false
        },
        {
          id: 27,
          title: "Animals",
          selected: false
        },
        {
          id: 28,
          title: "Vehicles",
          selected: false
        },
        {
          id: 29,
          title: "Entertainment: Comics",
          selected: false
        },
        {
          id: 30,
          title: "Science: Gadgets",
          selected: false
        },
        {
          id: 31,
          title: "Entertainment: Japanese Anime & Manga",
          selected: false
        },
        {
          id: 32,
          title: "Entertainment: Cartoon & Animations",
          selected: false
        }
      ],
      questionsCount: 10,
      questionsTypes: "multiple",
      quizDone: false,
      scoreList: [{ questionsViewed: 0, correct: 0, inCorrect: 0, skipped: 0 }],
      scoreFields: {
          questionsViewed: {
            label: 'Questions',
            sortable: false
          },
          correct: {
            label: 'Correct',
            sortable: false
          },
          inCorrect: {
            label: 'Incorrect',
            sortable: false
          },
          skipped: {
            label: 'skipped',
            sortable: false
          }
        },
    };
  },
  created: function() {},
  mounted: function() {
    this.loadData();
  },
  updated: function() {},
  destroyed: function() {}
};
</script>

<style>
</style>
