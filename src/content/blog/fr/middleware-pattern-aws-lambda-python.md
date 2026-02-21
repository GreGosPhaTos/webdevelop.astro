---
title: "Le Pattern Middleware avec AWS Lambda et Python"
description: "Comment implémenter le pattern middleware dans les fonctions AWS Lambda avec les décorateurs Python."
pubDate: 2021-07-26
tags: ["AWS", "Python", "Lambda", "Middleware", "Design Patterns"]
---

> *Cet article est également disponible sur [Medium](https://medium.com/@adrien.petitjean84/middleware-pattern-with-aws-lambdas-and-python-bee87667d908).*

Imaginons que vous souhaitez passer à Python et écrire vos AWS Lambdas avec ce formidable langage.
Et pour couronner le tout, *vous voulez utiliser le pattern middleware*. Autrement dit, vous souhaitez :

1. Garder la logique métier dans la fonction handler.
2. Exécuter n'importe quel type de code dans un middleware.
3. Lire ou modifier des objets de contexte si nécessaire.
4. Terminer le cycle middleware.
5. Appeler la prochaine fonction middleware dans la chaîne.

Au moment où j'écris ces lignes, je n'ai trouvé aucune bibliothèque middleware en Python pour les AWS Lambdas.
Mais bien sûr, il existe une solution à chaque problème, surtout avec Python !

## Le Pattern Décorateur

Une façon très pratique de reproduire le comportement du pattern middleware est d'utiliser le **pattern décorateur**.

Le décorateur est un design pattern qui permet d'ajouter une nouvelle fonctionnalité à un objet ou une fonction sans modifier sa structure.

Sur cette base, essayons de réécrire le middleware de logging et le middleware de gestion d'erreurs avec des décorateurs Python.

### Le Middleware de Logging

Le décorateur logger, qui est une closure, prend le handler en paramètre ; `*args` représente l'événement et les paramètres de contexte transmis au handler.

```python
def logger(handler):
    def wrapper(*args, **kwargs):
        print("Log avant le handler")
        return handler(*args, **kwargs)
    return wrapper
```

Dans cet exemple, le décorateur logger est attaché au handler et affichera le message "Log avant le handler" avant l'exécution de celui-ci.
Si l'on souhaite effectuer une action après le handler, la fonction wrapper peut sauvegarder la valeur de retour du handler, puis exécuter d'autres instructions ensuite.

### Le Middleware de Gestion d'Erreurs

Essayons maintenant d'implémenter notre gestionnaire d'erreurs !

```python
def error_handler(env):
    def decorator(handler):
        def wrapper(*args, **kwargs):
            try:
                return handler(*args, **kwargs)
            except Exception as e:
                print(f"Erreur interceptée dans {env} : {str(e)}")
                return {
                    'statusCode': 500,
                    'body': f"Erreur interne du serveur dans {env}"
                }
        return wrapper
    return decorator
```

Dans cet exemple, le décorateur `error_handler` prend le paramètre `env`. De la même façon, on peut passer n'importe quel contexte, configuration ou options au décorateur.

### Assemblage Final

Le handler possède maintenant 2 décorateurs, et l'ordre a son importance : le décorateur logger sera appelé en premier, l'error_handler en second. On passe l'environnement directement à l'error_handler.

```python
@logger
@error_handler(env="production")
def lambda_handler(event, context):
    # Votre logique métier ici
    return {
        'statusCode': 200,
        'body': 'Bonjour depuis Lambda !'
    }
```

L'`error_handler` intercepte les exceptions et renvoie une réponse d'erreur si une exception est levée.

### Conclusion

Pour résumer, l'implémentation du pattern middleware avec les décorateurs Python répond à tous les points que nous avions posés :

- La logique métier reste bien encapsulée dans la fonction handler.
- On peut exécuter n'importe quel type de code dans un décorateur, et même lui passer des paramètres.
- On peut manipuler des objets de contexte, car ils sont passés à la fonction wrapper.
- On peut terminer le cycle middleware en levant une exception par exemple.
- Appeler la prochaine fonction middleware dans la chaîne, en appelant simplement le handler depuis le décorateur.

Voilà, c'est tout ! J'espère que cet article vous a plu, n'hésitez pas à commenter et à partager vos réflexions.
