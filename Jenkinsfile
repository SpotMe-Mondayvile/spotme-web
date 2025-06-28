def s_branch = env.BRANCH_NAME as String
def registry = "containerregistry.spot-me-app.com/spotme/" as String
def localRegistry = "http://192.168.1.227:8082/" as String
def localRegistryUrl = "http://192.168.1.227:8082" as String
def registryUrl = "https://containerregistry.spot-me-app.com" as String
s_branch = s_branch.replaceAll("/","_")

pipeline{
    agent any
    stages{
        stage("Clean Up"){
            steps{
                deleteDir()
            }
        }
        stage("Clone repo"){
            steps{
                checkout scm
            }
        }

        stage("Build"){
            steps{
               dir("./"){
                sh '''
                npm install
                npm install @ionic/cli
                npm install axios
                ionic build
                tar -czvf spotme-web-archive.tar.gz dist
                '''
               }
            }
        }
        stage("Test"){
            steps
               dir("./"){
               sh ''' echo "Fake Test" '''
              }
            }
        }
        stage("Archive Build"){
            steps{
               archiveArtifacts artifacts: 'spotme-web-archive.tar.gz*', followSymlinks: false
            }
        }
//        stage("Build Container Images"){
//            steps(){
//                dir("spotme-rest/"){
//                sh """ docker build -t ${registry}spotme-rest:${s_branch} . """
//                }
//                dir("spotme-web/"){
//                sh """ docker build -t ${registry}spotme-web:${s_branch} . """
//                }
//            }
//        }
        stage("Image Upload"){
            steps(){
                script{
                    dir("./"){
                        try{
                            docker.withRegistry(registryUrl,'spotme-containerregistry') {
                                sh "docker system prune -a -f"

                                def smweb = docker.build("spotme/spotme-web:${s_branch}","./spotme-web")
                                //"docker push ${registry}spotme-web:${s_branch}"

                                // or docker.build, etc.
                                smweb.push()
                                echo DOCKER_IMAGE_NAME='''+image_name+''' > pipeline.properties
                                sh "echo DOCKER_IMAGE_NAME=${smweb.imageName()} >> imageRef.properties"
                            }
                        }catch(e){
                            echo 'Tunnel URL did not work for image push, trying to push via intranet'
                            docker.withRegistry(localRegistryUrl,'spotme-containerregistry') {

                                def smweb_l = docker.build("spotme/spotme-web:${s_branch}","./spotme-web")

                                // or docker.build, etc.
                                smrest_l.push()
                                smweb_l.push()
                            }
                        }
                    }

                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    dir("spotme-rest/"){
                        def mvn = tool 'maven';
                        try{
                        withSonarQubeEnv() {
                            sh "${mvn}/bin/mvn clean verify sonar:sonar -Dsonar.projectKey=spotme -Dsonar.projectName='spotme'"
                        }}catch (e){
                            println "Sonar Analysis could not operate"
                        }
                    }
            }
            }
        }
        stage("Store Pipeline Artifacts"){
            steps{
               archiveArtifacts artifacts: 'spotme-web-archive.tar.gz*', followSymlinks: false
               archiveArtifacts artifacts: 'imageRef.properties', followSymlinks: false
            }
        }

    }
    post {
           always{
                cleanWs()
           }
    }

// node {
//     // some block
//     git branch: env.BRANCH_NAME, url: 'git@github.com:SpotMe-Mondayvile/spotme.git'
//
// sh '''
// cd spotme-web
// npm install
// npm install -g serve
// npm run build
// tar -czvf spotme-web-archive.tar.gz build
// serve -s build
// cd ..'''
//
// sh '''
// cd spotme-rest
// mvn package -ntp -Dmaven.test.skip
// '''
//
// def projectVersion = sh script: "cd spotme-rest && mvn -q -Dexec.executable=echo -Dexec.args='\${project.version}' --non-recursive exec:exec", returnStdout: true
//
// sh'''cd ..'''
// archiveArtifacts artifacts: 'spotme-web/spotme-web-archive.tar.gz*', followSymlinks: false
// archiveArtifacts artifacts: 'spotme-rest/target/*.jar', followSymlinks: false
//
// // sh '''docker image ls'''
// }
