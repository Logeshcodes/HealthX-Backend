# Deployment Flow for Your Microservices Application on GKE

## Deployment Order

# path
cd "E:\Second-Project\HealthX-Backend\"


1. **Create and connect to the GKE cluster**

   ```
   gcloud container clusters get-credentials healthx-cluster-1 --region=asia-east1-c --project=<PROJECT_ID>


   gcloud projects list


   gcloud container clusters get-credentials healthx-cluster-1 --region=asia-south1-a --project=healthx-second-project


   ```

2. **Install core infrastructure components**

   - Deploy NGINX Ingress Controller

   ```
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.1/deploy/static/provider/cloud/deploy.yaml
   ```

   - Deploy cert-manager

   ```
   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.1/cert-manager.yaml
   ```

   ////////////

   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.1/deploy/static/provider/cloud/deploy.yaml
   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.1/cert-manager.yaml

3. **Create ConfigMaps for all services**

   # basic :

   kubectl get configmap

   kubectl delete configmap user-service-env

   ```
   cd authService
   kubectl create configmap auth-service-env --from-env-file=.env.production
   cd ..
   cd userService
   kubectl create configmap user-service-env --from-env-file=.env.production
   cd ..
   cd bookingService
   kubectl create configmap booking-service-env --from-env-file=.env.production
   cd ..
   cd notificationService
   kubectl create configmap notification-service-env --from-env-file=.env.production
   cd ..
   cd userService
   kubectl create configmap user-service-env --from-env-file=.env.production
   cd ..
   cd verificationService
   kubectl create configmap verification-service-env --from-env-file=.env.production
   cd ..
   cd videoCallService
   kubectl create configmap video-call-service-env --from-env-file=.env.production
   cd ..
   cd api-gateway
   kubectl create configmap api-gateway-env --from-env-file=.env.production

   cd ..
   cd ..
   cd HealthX-Frontend
   kubectl create configmap frontend-service-env --from-env-file=.env.production

   cd ..
   cd HealthX-Backend
   cd k8s

   ```

4. **Deploy message broker infrastructure**

   - Deploy Zookeeper and Kafka services

   ```
   kubectl apply -f zookeeper-depl.yaml
   kubectl apply -f kafka-depl.yaml
   kubectl apply -f topics-depl.yaml

   ```

5. **Deploy application services**

   - Backend services

   ```
   kubectl apply -f auth-service-depl.yaml
   kubectl apply -f user-service-depl.yaml
   kubectl apply -f booking-service-depl.yaml
   kubectl apply -f notification-service-depl.yaml
   kubectl apply -f verification-service-depl.yaml
   kubectl apply -f video-call-service-depl.yaml
   ```

   - API Gateway

   ```
   kubectl apply -f api-gateway-depl.yaml
   ```

   - Frontend service

   ```
   kubectl apply -f frontend-service-depl.yaml

   ............


   kubectl apply -f zookeeper-depl.yaml
   kubectl apply -f kafka-depl.yaml
   kubectl apply -f topics-depl.yaml
   kubectl apply -f auth-service-depl.yaml
   kubectl apply -f user-service-depl.yaml
   kubectl apply -f booking-service-depl.yaml
   kubectl apply -f notification-service-depl.yaml
   kubectl apply -f verification-service-depl.yaml
   kubectl apply -f video-call-service-depl.yaml
   kubectl apply -f api-gateway-depl.yaml
   kubectl apply -f frontend-service-depl.yaml




   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.1/deploy/static/provider/cloud/deploy.yaml


   kubectl apply -f ingress-nginx-depl.yaml

   ```

   ```

   ```

6. **Configure TLS and certificates**

   - Deploy LetsEncrypt ClusterIssuer

   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.crds.yaml

   ```
   kubectl apply -f letsencrypt-prod.yaml
   ```

   - Configure Certificate

   ```
   kubectl apply -f certificate.yaml
   ```

7. **Configure Ingress**

   ```
   kubectl apply -f ingress-ngix-depl.yaml
   ```

8. **Verify deployment**

   ```
   kubectl get pods
   kubectl get services
   kubectl get ingress

   kubectl get configmaps
   ```

## Important Notes

1. You have two Zookeeper deployments in your manifests (zookeeper-depl.yaml and another in kafka-zookeeper.yaml). You should only deploy one Zookeeper instance to avoid conflicts.

2. Make sure your certificate.yaml file has the correct secretName value, as it appears to be missing in the ingress TLS configuration.

3. Ensure your .env.production files contain all necessary environment variables for each service.

4. Consider adding resource limits and requests to your container specifications for better resource management.

5. Set up monitoring and logging for your cluster using GCP's built-in monitoring tools or deploy Prometheus and Grafana.

##### Delete Notes

Since you already have all services running, you have a few options depending on what you're trying to achieve. Here's how to handle your situation:

### Option 1: If you want to restart your deployment with the correct order

If your services are already running but you've encountered issues and want to restart following the recommended order:

1. **Delete all current resources (but keep ConfigMaps if they're properly configured)**

   ```
   kubectl delete deployment --all
   kubectl delete service --all
   kubectl delete ingress --all
   kubectl delete job.batch/create-kafka-topics
   kubectl delete configmaps --all

   kubectl delete job create-kafka-topics
   kubectl delete -f topics-depl.yaml


   ```

   Note: This does NOT delete your ConfigMaps, so you won't need to recreate them if they're properly set up.

2. **Then follow the deployment order I provided**, skipping the ConfigMap creation step if your ConfigMaps are already correctly configured.

### Option 2: If everything is working but you want to ensure proper configuration

If your services are running and working correctly, but you just want to ensure proper configuration:

1. **Verify your current setup**

   ```
   c   kubectl get configmap
   kubectl get ingress
   kubectl describe ingress ingress-controller
   kubectl get jobs


   ```

2. **Apply any missing or incorrectly configured components**
   For example, if you notice the TLS configuration is incorrect:

   ```
   kubectl apply -f certificate.yaml
   kubectl apply -f letsencrypt-prod.yaml
   kubectl apply -f ingress-ngix-depl.yaml

   ```

### Option 3: If you encounter specific issues with certain services

If only specific services are having issues:

1. **Restart just those services**

   ```
   kubectl rollout restart deployment [deployment-name]
   ```

   For example:

   ```
   kubectl rollout restart deployment api-gateway
   ```

2. **Or delete and recreate specific deployments**
   ```
   kubectl delete deployment [deployment-name]
   kubectl apply -f [deployment-file].yaml
   ```

### Key things to check if you're having issues:

1. **ConfigMap validation**
   ```
   kubectl describe configmap [configmap-name]
   ```
2. **Pod logs**
   ```
   kubectl logs -f deployment/[deployment-name]
   ```
3. **Service connections**

   ```
   kubectl exec -it [pod-name] -- curl [service-name]:[port]
   ```

4. **Ingress configuration**
   ```
   kubectl describe ingress ingress-controller
   ```

If you're generally satisfied with how things are working but want to ensure you've followed best practices, you can simply verify the configurations rather than recreating everything from scratch.

kubectl delete deployment --all
kubectl delete service --all
kubectl delete ingress --all
kubectl delete job.batch/create-kafka-topics

kubectl delete pods --all


kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.1/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.1/cert-manager.yaml
cd k8s
kubectl apply -f zookeeper-depl.yaml
kubectl apply -f kafka-depl.yaml --validate=false
kubectl apply -f topics-depl.yaml
kubectl apply -f auth-service-depl.yaml
kubectl apply -f user-service-depl.yaml
kubectl apply -f booking-service-depl.yaml
kubectl apply -f notification-service-depl.yaml
kubectl apply -f verification-service-depl.yaml
kubectl apply -f video-call-service-depl.yaml
kubectl apply -f api-gateway-depl.yaml
kubectl apply -f frontend-service-depl.yaml
kubectl apply -f ingress-nginx-depl.yaml

# to delete everything

kubectl delete all --all
