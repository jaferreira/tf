<template>
    <div class="error-page">
        <h1>{{title}}</h1>
        <div v-if="debug">
            <p>Error code: {{errorCode}}</p>
            <p>Traceback:</p>
            <pre>
                {{error}}
            </pre>
        </div>
        <div v-else>
            <p>Error...</p>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {}
    }
}
</script>

<style lang="css">

</style>
