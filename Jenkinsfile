pipeline {
    agent { node { label '!master' } }

    options {
       timestamps()
       timeout(time: 30, unit: 'MINUTES')
       buildDiscarder(logRotator(numToKeepStr: '15'))
    }

    stages {
        stage('CI') {
            when {
                anyOf {
                    branch 'master'
                    branch 'develop'
                    buildingTag()
                    changeRequest()
                }
            }
            steps {
                script {
                    try {
                        git url: 'https://github.com/mssalazarb/zwippe.git', branch: 'feature/TEST-JNK'

                        node {
                            stage ('Build') {
                                script {
                                    try {
                                       echo 'Build'
                                       sh 'docker build -t zwippe-users .'
                                    } catch (err) {
                                       echo err.getMessage()
                                       echo "Error detected, but we will continue."
                                       throw e
                                    }
                                }
                            }
                        }

                        node {
                            stage ('Test') {
                                script {
                                    try {
                                       echo 'Test'
                                       sh 'docker-compose run --rm test'
                                    } catch (err) {
                                       echo err.getMessage()
                                       echo "Error detected, but we will continue."
                                       throw e
                                    }
                                }
                            }
                        }

                        node {
                            stage ('Teardown') {
                                script {
                                    try {
                                       echo 'Teardown'
                                       sh 'docker-compose down -v'
                                    } catch (err) {
                                       echo err.getMessage()
                                       echo "Error detected, but we will continue."
                                       throw e
                                    }
                                }
                            }
                        }

                        node {
                            stage ('Sonar') {
                                script {
                                    try {
                                       def scannerHome = tool 'SonarScanner 4.0';
                                        withSonarQubeEnv('My SonarQube Server') {
                                            sh "${scannerHome}/bin/sonar-scanner"
                                       }
                                    } catch (err) {
                                       echo err.getMessage()
                                       echo "Error detected, but we will continue."
                                       throw e
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        cleanWs()
                        deleteDir() /* clean up our workspace */
                    }
                }
            }
        }

        stage("End") {
            steps {
                script {
                    sh "echo DONE"
                }
            }
        }
    }

    post {
        always {
            sh "sudo chmod -R 777 ."
            cleanWs()
            deleteDir() /* clean up our workspace */
        }
    }
}
