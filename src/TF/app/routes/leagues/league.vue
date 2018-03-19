<template>

    <div>

      <form action="/league/scrap" method="post">
          <label for="team_name">Enter name: </label>
          <input id="team_name" type="text" name="name_field" value="Default name for team.">
          <input type="submit" value="OK">
      </form>
      <hr/>
        <div>
            <h1>{{title}}</h1>
            <h3>{{subtitle}}</h3>
        </div>

      <div>
      
      </div>

    <div>
      <div>
        <p>Title Holder: {{data.titleHolder}}</p>
      </div>


  <hr/>
       

    <table>
      <tr>
        <th>#</th>
        <th>Equipa</th>
        <th>Jogos</th>

        <th>Vitórias</th>
        <th>Empates</th>
        <th>Derrotas</th>

        <th>Golos Marcados</th>
        <th>Golos Sofridos</th>
        <th>Pontos</th>

        
        
      </tr>

      <tr v-for="standing in standings">
             
               <td>{{standing.position}}</td>
               <td>{{ standing.teamName }}</td>
               <td>{{ standing.gamesPlayed }}</td>
               <td>{{ standing.wins }}</td>
               <td>{{ standing.draws }}</td>
               <td>{{ standing.defeateds }}</td>
               <td>{{ standing.goalScored }}</td>
               <td>{{ standing.goalConceded }}</td>
               <td>{{standing.points}}</td>
          </tr>
    </table>

  <hr/>
        <div>
          <h3>Top Scores</h3>
          <p v-for="topScore in data.topScores">
              {{topScore.position}}. {{topScore.name}} ({{topScore.team}}): {{ topScore.goals }}  
          </p>
        </div>

      
        <hr/>
        <div>
          <h3>Facts</h3>
          <ul>
            
            
            <li><strong>Divisão:</strong> {{data.facts.devisionLevel}}</li>
            <li><strong>Jornadas:</strong> {{data.facts.numberRounds}}</li>

            <li><strong>Vitórias em casa:</strong> {{data.facts.homeTeamWins}}</li>
            <li><strong>Vitórias fora:</strong> {{data.facts.awayTeamWins}}</li>
            <li><strong>Média de Golos:</strong> {{data.facts.averageGoals}}</li>
            
            <li><strong>Cartões Vermelhos:</strong> {{data.facts.redCards}}</li>
            <li><strong>Cartões Amarelos:</strong> {{data.facts.yellowCards}}</li>
          </ul>
        </div>
    
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
