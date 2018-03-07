<template>
    <div>
        <div>
            <h1>{{title}}</h1>
        </div>

      <div>
      
      </div>

    <div>
      
        <p v-for="league in leagues">
            <a :href="league.link">{{league.name}}</a>
        </p>
    
    </div>
    </div>
</template>

<script>
export default {
  data: function() {
    return {
      title: ""
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-weight: normal;
}

a {
  color: #42b983;
}
</style>
