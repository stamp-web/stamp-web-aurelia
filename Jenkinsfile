pipeline {
    agent any

    triggers {
        upstream(
            upstreamProjects: 'stamp-webservices',
            threshold: hudson.model.Result.SUCCESS
        )
        cron('H/15 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/master']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/stamp-web/stamp-web-vuejs.git',
                        credentialsId: 'jadrake-github'
                    ]]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Unit Tests') {
            steps {
                dir('test/unit') {
                    sh 'au test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test/unit/**/*.xml'
                }
            }
        }

        stage('Production Build') {
            steps {
                sh 'au build --env prod'
            }
        }

        stage('Stamp Build') {
            steps {
                sh '''
                    echo "{\"buildTime\": ${BUILD_ID}}\" > build-number.json
                    echo "${JOB_NAME} ${BUILD_ID}" > /tmp/build-stampweb.trigger
                '''
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'build-number.json', fingerprint: true
        }
    }
}
