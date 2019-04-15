<template>
  <b-navbar fixed="bottom" type="dark" variant="dark">
   <b-navbar-brand href="#">Quiz</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
        <b-form-select
          :options="questionsCategories"
          :disabled="this.isLoading === 1"
          text-field="title"
          value-field="id"
          value="9"
          @change="questionCategorySelected"
        ></b-form-select>
        </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
    props: {
        isLoading: Number,
        questionsCategories: Array,
        questionCategorySelected: Function
    },
    data: function(){
        return {

        };
    }
}
</script>